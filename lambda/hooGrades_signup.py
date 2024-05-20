import json
import boto3
from botocore.exceptions import ClientError

def signup(table, email, password, first_name, last_name, role):
    try:
        response = table.get_item(Key={"email": email})
        if "Item"  in response:
            return 1    # user already exists
        table.put_item(
            Item={
                "email": email,
                "first_name": first_name,
                "last_name": last_name, 
                "password": password, 
                "course_name": [],
                "role": role, })
        response = table.get_item(Key={"email": email})
        return (response["Item"]['first_name'], response["Item"]['role'])    # success
    except ClientError as err:
        return 3    # unexpected error

def lambda_handler(event, context):    
    data = json.loads(json.dumps(event))
    body = json.loads(data["body"])
    input_email = body["email"]
    input_password = body["password"]
    input_first_name = body["first_name"]
    input_last_name = body["last_name"]
    input_role = body["role"]
    
    table = boto3.resource('dynamodb', region_name='us-east-1').Table('Users')
    status = signup(table, input_email, input_password, input_first_name, input_last_name, input_role)
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
        response['body'] = json.dumps({"first_name": status[0], "role": status[1]})
    
    print(response)
    return response