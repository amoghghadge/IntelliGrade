import json
import boto3
from botocore.exceptions import ClientError
from datetime import datetime

def addCourse(table, course_name, course_table, email, body):
    try:
        response = table.get_item(Key={"email": email}) #User
        course_response = course_table.get_item(Key={"course_name": course_name}) #Course


        course_list = response["Item"]["course_name"] #User's past coursees
        role = response["Item"]["role"].lower() 
        if role == "student":
            if "Item" not in course_response:
                return 1    # course does not exist when trying to join
            for course in course_list:
                if course == course_name:
                    return 3 #User is already in course
            course_list.append(course_name)
            response = table.update_item(
                Key={"email": email},
                UpdateExpression='SET #course_name = :name',
                ExpressionAttributeNames={
                    '#course_name': 'course_name',  # Use ExpressionAttributeNames to avoid conflict with reserved words
                },
                ExpressionAttributeValues={
                    ':name': course_list,  # Use ExpressionAttributeValues to avoid conflict with reserved words', 
                },
                ReturnValues='UPDATED_NEW',)
            return 100    # success
        elif role == "teacher":
            description = body["description"]
            if "Item" in course_response:
                return 2    # course exists when trying to create
            
            course_list.append(course_name)
            course_table.put_item(
                Item={
                    "course_name": course_name,
                    "assignments": [],
                    "description": description})
            response = table.update_item(
            Key={"email": email},
            UpdateExpression='SET #course_name = :name',
            ExpressionAttributeNames={
                '#course_name': 'course_name',  # Use ExpressionAttributeNames to avoid conflict with reserved words
            },
            ExpressionAttributeValues={
                ':name': course_list,  # Use ExpressionAttributeValues to avoid conflict with reserved words', 
                },
                ReturnValues='UPDATED_NEW',)    
            return 100    # success
    except ClientError as err:
        return 4    # unexpected error



def lambda_handler(event, context):    
    data = json.loads(json.dumps(event))
    body = json.loads(data["body"])
    email = body["email"]
    course_name = body["course_name"]
    
    table = boto3.resource('dynamodb', region_name='us-east-1').Table('Users')
    course_table = boto3.resource('dynamodb', region_name='us-east-1').Table('Courses')

    status = addCourse(table, course_name, course_table, email, body)
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
        response['body'] = json.dumps({"message": "Course does not exist when Student is trying to join"})
    elif status == 2:
        response['statusCode'] = 400
        response['body'] = json.dumps({"message": "Course exists when Teacher is trying to create"})
    elif status == 3:
        response['statusCode'] = 400
        response['body'] = json.dumps({"message": "User is already in course"})
    elif status == 4: 
        response['statusCode'] = 400
        response['body'] = json.dumps({"message": "Unexpected Error"})
    else:
        response['statusCode'] = 200
        response['body'] = json.dumps({"success": "Added Course"})
    
    print(response)
    return response