import json
import boto3
from botocore.exceptions import ClientError
from datetime import datetime

def getQuestionFromAssignment(table, assignment_id, question_table):
    try:
        response = table.get_item(Key={"assignment_id": assignment_id}) #User
        if "Item" not in response:
            return 2; #Assignment does not exist
        question_ids = response["Item"]["questions"]
        list = []
        
        for question_id in question_ids:
            question = question_table.get_item(Key={"question_id": question_id})
            list.append({"question_number": str(question["Item"]["question_number"]),
                          "Points": str(question["Item"]["points"]), 
                          "rubric": question["Item"]["rubric"],  
                          "content": question["Item"]["content"],
                          })
        return (list, response["Item"]["assignment_name"], response["Item"]["status"], response["Item"]["feedback"], response["Item"]["submission"])
    except ClientError as err:
        return 1    # unexpected error

def lambda_handler(event, context):    
    data = json.loads(json.dumps(event))
    body = json.loads(data["body"])
    assignment_id = body["assignment_id"]
    table = boto3.resource('dynamodb', region_name='us-east-1').Table('Assignments')
    question_table = boto3.resource('dynamodb', region_name='us-east-1').Table('Questions')
    status = getQuestionFromAssignment(table, assignment_id, question_table)
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
        response['body'] = json.dumps({"message": "Unexpected Error"})
    elif status == 2:
        response['statusCode'] = 400
        response['body'] = json.dumps({"message": "Assignment Does not exist"})
    else:
        response['statusCode'] = 200
        response['body'] = json.dumps({"questions": status[0], "assignment_name": status[1], "status": status[2], "feedback": status[3], "submission": status[4]})
    
    print(response)
    return response