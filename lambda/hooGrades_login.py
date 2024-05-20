import json
import boto3
from botocore.exceptions import ClientError

def get_user(table, email, password):
    try:
        response = table.get_item(Key={"email": email})
        if "Item" not in response:
            return 1    # user does not exist
        
        if response["Item"]['password'] != password:
            return 2    # incorrect password
        
        return (response["Item"]['first_name'], response["Item"]['role'])    # success
    except ClientError as err:
        return 3    # unexpected error

def lambda_handler(event, context):    
    data = json.loads(json.dumps(event))
    body = json.loads(data["body"])
    input_email = body["email"]
    input_password = body["password"]
    
    table = boto3.resource('dynamodb', region_name='us-east-1').Table('Users')
    status = get_user(table, input_email, input_password)
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
        response['body'] = json.dumps({"message": "User does not exist"})
    elif status == 2:
        response['statusCode'] = 400
        response['body'] = json.dumps({"message": "Incorrect Password"})
    elif status == 3:
        response['statusCode'] = 400
        response['body'] = json.dumps({"message": "Unexpected Error"})
    else:
        response['statusCode'] = 200
        response['body'] = json.dumps({"first_name": status[0], "role": status[1]})
    
    print(response)
    return response