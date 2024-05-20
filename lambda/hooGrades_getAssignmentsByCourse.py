import json
import boto3
from botocore.exceptions import ClientError

def getAssignmentsByCourse(table, course_table, assignment_table, email, course_name):
    try:
        user = table.get_item(Key={"email": email})
        course = course_table.get_item(Key={"course_name": course_name})
        if "Item" not in user:
            return 1 #User does not exist;
        if "Item" not in course:
            return 2 # course does not exist; 
        
        list = []
        
        for assignment_id in course["Item"]["assignments"]:
            assignment = assignment_table.get_item(Key={"assignment_id": assignment_id})
            #Assignment Name, Due Date, Assigned Date, Status
            if assignment["Item"]["user_id"] == email:
                list.append({"assignment_id": assignment_id, 
                            "assignment_name" : assignment["Item"]["assignment_name"],
                            "due_date": assignment["Item"]["due_date"],
                            "assigned_date": assignment["Item"]["assigned_date"],
                            "status": assignment["Item"]["status"]})
        return list    # success
    except ClientError as err:
        return 3    # unexpected error

def lambda_handler(event, context):    
    data = json.loads(json.dumps(event))
    body = json.loads(data["body"])
    input_email = body["email"]
    input_course_name = body["course_name"]
    
    table = boto3.resource('dynamodb', region_name='us-east-1').Table('Users')
    course_table = boto3.resource('dynamodb', region_name='us-east-1').Table('Courses')
    assignment_table = boto3.resource('dynamodb', region_name='us-east-1').Table('Assignments')

    status = getAssignmentsByCourse(table, course_table, assignment_table, input_email, input_course_name)
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
        response['body'] = json.dumps({"message": "User does not exists"})
    elif status == 2:
        response['statusCode'] = 400
        response['body'] = json.dumps({"message": "Course does not exist"})
    elif status == 3:
        response['statusCode'] = 400
        response['body'] = json.dumps({"message": "Unexpected Error"})
    else:
        response['statusCode'] = 200
        response['body'] = json.dumps({"assignments" : status})
    
    print(response)
    return response