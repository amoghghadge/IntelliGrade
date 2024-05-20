import json
import boto3
from botocore.exceptions import ClientError
# from openai import OpenAI


# must update assignment id's status and feedback
def updateAssignment(
    table, assignment_id, resp_feedback, resp_status
):  # also use context (few shot examples)
    try:
        response = table.update_item(
            Key={
                "assignment_id": assignment_id,
            },
            UpdateExpression="SET feedback = :fb, #st = :stat",
            ExpressionAttributeValues={
                ":fb": resp_feedback,
                ":stat": resp_status,
            },
            ExpressionAttributeNames={
                "#st": "status",  # Substituting reserved keyword with a placeholder
            },
            ReturnValues="UPDATED_NEW",
        )

        return 1
    except ClientError as err:
        print(f"Error updating item: {err}")
        return 3  # unexpected error


def lambda_handler(event, context):
    data = json.loads(json.dumps(event))
    body = json.loads(data["body"])
    input_assignment_id = body["assignment_id"]
    input_resp_feedback = body["feedback"]
    input_status = body["status"]
    print(input_assignment_id, input_resp_feedback, input_status)

    assignment_table = boto3.resource("dynamodb", region_name="us-east-1").Table("Assignments")

    status = updateAssignment(assignment_table, input_assignment_id, input_resp_feedback, input_status)
    print("called get_user and got", status)

    response = {
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        }
    }

    if status == 3:
        response['statusCode'] = 400
        response['body'] = json.dumps({"message": "Unexpected Error"})
    else:
        response["statusCode"] = 200
        response["body"] = json.dumps({"success": "Assignments updated"})

    print(response)
    return response
