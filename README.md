# find-places-around
This is repository of project, that uses aws lambda service to implement serverless architecture.

Try how it works:
    Use one of next urls to get response:

    https://l27qkn0dl5.execute-api.us-east-1.amazonaws.com/dev/venues.csv
    https://l27qkn0dl5.execute-api.us-east-1.amazonaws.com/dev/venues.json

    Make POST request with next parameters:

    {
        venueType: String in legth from 1 to 20 latin letters,
        radius: Number from 0 to 1000,
        latitude: Float number from -89.9... to 89.9...,
        longitude: Float number from -89.9... to 89.9...,
    }
    
It is not working now because I've changed all credentials in my AWS account. Feel free to download and use your own lambda.
