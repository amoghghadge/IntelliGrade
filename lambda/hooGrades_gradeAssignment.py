import json
import boto3
from botocore.exceptions import ClientError
from openai import OpenAI


# must update assignment id's status and feedback
def gradeAssignment(
    table, assignment_id, submission, rubric
):  # also use context (few shot examples)
    client = OpenAI()

    response = client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "You are a component in an AI autograder that needs to transcribe a student's work into plain text. Please transcribe the image into plaintext. Do not respond with anything else.",
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": submission,
                        },
                    },
                ],
            }
        ],
    )
    work = response.choices[0].message.content
    print(work)

    prompt = """
    You are an AI autograder that takes a students work and a rubric for each question, then reasons about what score to give the student based on how well the work matches the rubric criteria.
    The work will contain the student's work across all questions (which will be labeled by number), and you must use the appropriate question rubric to evaluate it.
    The output should be formatted as a JSON instance where one key 'grade' is the score the student deserves as a percent, and another key 'feedback' is your reasoning for why they got that score based on the rubric items.
    """

    response = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": prompt},
            {
                "role": "user",
                "content": "STUDENT'S WORK: " + work + " RUBRIC: " + rubric,
            },
        ],
    )
    print(response)
    resp_status = str(json.loads(response.choices[0].message.content)["grade"])
    resp_feedback = str(json.loads(response.choices[0].message.content)["feedback"])
    print(resp_status, resp_feedback)
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
    print(response)


def getAssignmentsByCourse(
    course_table, question_table, assignment_table, course_name, input_assignment_name
):
    try:
        course = course_table.get_item(Key={"course_name": course_name})
        if "Item" not in course:
            return 2  # course does not exist;

        for assignment_id in course["Item"]["assignments"]:
            assignment = assignment_table.get_item(Key={"assignment_id": assignment_id})
            if (
                assignment["Item"]["assignment_name"] == input_assignment_name
                and assignment["Item"]["status"] == "submitted"
            ):
                rubric = ""
                for question_id in assignment["Item"]["questions"]:
                    question = question_table.get_item(Key={"question_id": question_id})
                    rubric += (
                        "Question "
                        + str(question["Item"]["question_number"])
                        + " ("
                        + str(question["Item"]["points"])
                        + " points): "
                        + question["Item"]["content"]
                    )
                    rubric += ", Rubric: " + question["Item"]["rubric"] + "; "
                print("GRADING")
                gradeAssignment(
                    assignment_table,
                    assignment_id,
                    assignment["Item"]["submission"],
                    rubric,
                )
                # to_grade.append({
                #     "assignment_id": assignment_id,
                #     "submission": assignment["Item"]["submission"],
                #     "rubric": rubric,
                # })
        return 1
    except ClientError as err:
        print(err)
        return 3  # unexpected error


def lambda_handler(event, context):
    data = json.loads(json.dumps(event))
    body = json.loads(data["body"])
    input_course_name = body["course_name"]
    input_assignment_name = body["assignment_name"]

    course_table = boto3.resource("dynamodb", region_name="us-east-1").Table("Courses")
    question_table = boto3.resource("dynamodb", region_name="us-east-1").Table(
        "Questions"
    )
    assignment_table = boto3.resource("dynamodb", region_name="us-east-1").Table(
        "Assignments"
    )

    status = getAssignmentsByCourse(
        course_table,
        question_table,
        assignment_table,
        input_course_name,
        input_assignment_name,
    )
    print("called get_user and got", status)

    response = {
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        }
    }

    if status == 2:
        response["statusCode"] = 400
        response["body"] = json.dumps({"message": "User already exists"})
    elif status == 3:
        response["statusCode"] = 400
        response["body"] = json.dumps({"message": "Unexpected Error"})
    else:
        response["statusCode"] = 200
        response["body"] = json.dumps({"result": "Success"})

    print(response)
    return response
