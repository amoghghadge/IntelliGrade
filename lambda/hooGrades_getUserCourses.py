import json
import boto3
from botocore.exceptions import ClientError

def getUserCourses(table, email, CourseTable):
    try:
        response = table.get_item(Key={"email": email})
        list = []
        
        for course_name in response["Item"]["course_name"]:
            course = CourseTable.get_item(Key={"course_name": course_name})
            list.append({"course_name": course["Item"]["course_name"], "course_description": course["Item"]["description"]})

        return list    # success
    except ClientError as err:
        return 3    # unexpected error

def lambda_handler(event, context):    
    data = json.loads(json.dumps(event))
    body = json.loads(data["body"])
    input_email = body["email"]

    
    table = boto3.resource('dynamodb', region_name='us-east-1').Table('Users')
    courseTable = boto3.resource('dynamodb', region_name='us-east-1').Table('Courses')

    status = getUserCourses(table, input_email, courseTable)
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
        response['body'] = json.dumps({"message": "User already exists"})
    elif status == 3:
        response['statusCode'] = 400
        response['body'] = json.dumps({"message": "Unexpected Error"})
    else:
        response['statusCode'] = 200
        response['body'] = json.dumps({"courses": status})
    
    print(response)
    return response