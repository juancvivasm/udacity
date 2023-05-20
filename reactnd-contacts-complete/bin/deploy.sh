# Replace the [udagram-test01] below with the S3 bucket name
aws s3 cp --recursive --acl public-read ./build s3://myawsbucket-363605384631/
# The trailing / at the end of the URL is important. 