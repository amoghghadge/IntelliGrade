import json
import boto3
from botocore.exceptions import ClientError
from datetime import datetime

def submitAssignment(table, assignment_id, submission):
    try:
        # Use the update_item method to update the submission field of the item with the given assignment_id
        response = table.update_item(
            Key={
                'assignment_id': assignment_id,
            },
            UpdateExpression="SET submission = :sub, #st = :stat",
            ExpressionAttributeValues={
                ':sub': submission,
                ":stat": "submitted",  # Setting the status to "submitted"
            },
            ExpressionAttributeNames={
                "#st": "status",  # Substituting reserved keyword with a placeholder
            },
            ReturnValues="UPDATED_NEW"
        )
        return response
    except ClientError as err:
        print(err)
        return 1    # unexpected error

def lambda_handler(event, context):    
    data = json.loads(json.dumps(event))
    body = json.loads(data["body"])
    assignment_id = body["assignment_id"]
    submission = body["submission"]
    print(assignment_id, submission)
    table = boto3.resource('dynamodb', region_name='us-east-1').Table('Assignments')
    status = submitAssignment(table, assignment_id, submission)
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
    else:
        response['statusCode'] = 200
        response['body'] = json.dumps({"success": "Submission link added"})
    
    print(response)
    return response