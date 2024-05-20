import boto3
from decimal import Decimal
from botocore.exceptions import ClientError

class Users:
    """Encapsulates an Amazon DynamoDB table of movie data."""
    def __init__(self, dyn_resource):
        self.dyn_resource = dyn_resource
        self.table = dynamodb_resource.Table('Users')

    def add_user(self, email, first_name, last_name, password, course_ids, role):
        try:
            self.table.put_item(
                Item={
                    "email": email,
                    "first_name": first_name,
                    "last_name": last_name,
                    "password": password,
                    "course_ids": course_ids,
                    "role": role
                }
            )
        except ClientError as err:
            print(
                "Couldn't add movie %s to table %s. Here's why: %s: %s",
                email, self.table, err.response['Error']['Code'], err.response['Error']['Message']
            )
            raise

# Initialize a DynamoDB resource
dynamodb_resource = boto3.resource('dynamodb', region_name='us-east-1')

# Initialize the Movies class with the DynamoDB resource
users = Users(dynamodb_resource)
users.add_user("amoghghadge22@gmail.com", "Amogh", "Ghadge", "password123", [], "student")