import json
import boto3
from botocore.exceptions import ClientError
from datetime import datetime
def addQuestion(question_table, question_id, points, content, rubric, question_number):
    try:
        response = question_table.get_item(Key={"question_id": question_id})
        if "Item" in response:
            return 1    # question already exists
        question_table.put_item(
            Item={
                "question_id": question_id,
                "points": points,
                "content": content,
                "rubric": rubric,
                "question_number": question_number})
        return 100    # success
    except ClientError as err:
        return 2    # unexpected error
def addAssignments(user_table, course_table, question_table, assignment_table, questions, due_date, assignment_name, assigned_date, course_name):
    try:
        user_table = boto3.resource('dynamodb', region_name='us-east-1').Table('Users')
        course_table = boto3.resource('dynamodb', region_name='us-east-1').Table('Courses')
        question_table = boto3.resource('dynamodb', region_name='us-east-1').Table('Questions')
        assignment_table = boto3.resource('dynamodb', region_name='us-east-1').Table('Assignments')

        
        user_table = user_table.scan()
        users = user_table['Items']

        # Continue scanning if more items are available
        while 'LastEvaluatedKey' in user_table:
            user_table = user_table.scan(ExclusiveStartKey=user_table['LastEvaluatedKey'])
            users.extend(user_table['Items'])
        # Now, items holds all the records from the table
        assignment_keys = []
        for user in users:
            # Process each item here
            for user_course_name in user["course_name"]:
                if user_course_name == course_name:
                    user_id = user["email"]
                    status = "assigned"
                    if user["role"] == "student":
                        status = "No Submission"
                    elif user["role"] != "teacher":
                        return 2    # user is not a student or teacher
                    assignment_id = generate_partition_key(assignment_name)
                    assignment_table.put_item(
                    Item={
                        "assignment_id": assignment_id,
                        "user_id" : user_id,  
                        "questions": questions,
                        "due_date": due_date,
                        "assignment_name": assignment_name,
                        "assigned_date": assigned_date,
                        "submission" : "",
                        "feedback": "",
                        "status": status
                        }
                    )
                    assignment_keys.append(assignment_id)
        course_table.update_item(
            Key={"course_name": course_name},
            UpdateExpression='SET #assignments = list_append(if_not_exists(#assignments, :empty_list), :assignment_keys)',
            ExpressionAttributeNames={
                '#assignments': 'assignments',
            },
            ExpressionAttributeValues={
                ':assignment_keys': assignment_keys,
                ':empty_list': [],
            },
            ReturnValues='UPDATED_NEW',
        )
        return 100    # success
    except ClientError as err:
        return 4    # unexpected error


#Input -> Questions, Due Date, Assignment Name, Assigned Date; 

def generate_partition_key(user_id):
    timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S%f')
    return f"{user_id}-{timestamp}"

def lambda_handler(event, context):    
    data = json.loads(json.dumps(event))
    body = json.loads(data["body"])
    prequestions = body["questions"]
    question_table = boto3.resource('dynamodb', region_name='us-east-1').Table('Questions')

    questions = []
    for prequestion in prequestions:
        #make Question; 
        content = prequestion["content"]
        rubric = prequestion["rubric"]
        question_number = prequestion["question_number"]
        points = prequestion["points"]
        #make primary key
        question_id = generate_partition_key(question_number)
        #MAKE THE QUESTION 
        addQuestion(question_table, question_id, points, content, rubric, question_number)
        questions.append(question_id)
        
    due_date = body["due_date"]
    assignment_name = body["assignment_name"]
    assigned_date = str(datetime.now().strftime("%m/%d/%Y, %H:%M:%S"))
    
    assignment_id = generate_partition_key(assignment_name)
    course_name = body["course_name"]

    user_table = boto3.resource('dynamodb', region_name='us-east-1').Table('Users')
    course_table = boto3.resource('dynamodb', region_name='us-east-1').Table('Courses')
    assignment_table = boto3.resource('dynamodb', region_name='us-east-1').Table('Assignments')

    status = addAssignments(user_table, course_table, question_table, assignment_table, questions, due_date, assignment_name, assigned_date, course_name)
    print('called get_user and got', status)

    response = {
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        }
    }

    
    if status == 1:
        response['statusCode'] = 400
        response['body'] = json.dumps({"message": "Question already exists"})
    elif status == 2:
        response['statusCode'] = 400
        response['body'] = json.dumps({"message": "Unexpected Question Error"})
    elif status == 3:
        response['statusCode'] = 400
        response['body'] = json.dumps({"message": "Assignments already exists"})
    elif status == 4: 
        response['statusCode'] = 400
        response['body'] = json.dumps({"message": "Unexpected Assignment Error"})
    else:
        response['statusCode'] = 200
        response['body'] = json.dumps({"success": "Added Assignment"})
    
    print(response)
    return response