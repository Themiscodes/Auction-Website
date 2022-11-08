import math
import numpy as np
from numpy import dot

# Matrix Factorisation Algorithm Training
def matrixFactorisation(Ratings, features=2, epochs=4000, learningRate=0.01, weightDecay=0.0002, verbose=True):
    
    # Firstly, initialisation of the elements of the User and Item features matrices. 

    # I used a small range (up to 0.15 in this case) 
    # seems to work better than the normal range of up to 1 
    UserFeatures = np.random.uniform(0, 0.15, ( len(Ratings), features))
    ItemFeatures = np.random.uniform(0, 0.15, ( len(Ratings[0]), features))
    ItemFeatures = ItemFeatures.T

    # To be used later on the stopping condition
    bestRMSE = float("inf")

    # Not to be calculated over and over
    invariant = learningRate * weightDecay
    normaliz = weightDecay / 2

    for epoch in range(epochs):

        for i in range(len(Ratings)):
            for j in range(len(Ratings[i])):

                # Only if it is a known element
                # ie greater than zero
                if Ratings[i][j]>0:
                    
                    # Prediction is the dot product
                    prediction = dot(UserFeatures[i,:], ItemFeatures[:,j])

                    # Compute the error
                    error = Ratings[i][j]-prediction

                    # Compute the gradient of error squared and update the
                    # features with regularization to prevent large weights
                    for w in range(features):
                        UserFeatures[i][w] += (2 * learningRate * error * ItemFeatures[w][j] -  invariant * UserFeatures[i][w])
                        ItemFeatures[w][j] += (2 * learningRate * error * UserFeatures[i][w] -  invariant * ItemFeatures[w][j])

        # Calculate the RMSE
        MSE = 0 
        count = 0
        for i in range(len(Ratings)):
            for j in range(len(Ratings[i])):

                if Ratings[i][j]>0:
                    count+=1

                    # Loss function error sum 
                    MSE += pow(Ratings[i][j]-dot(UserFeatures[i,:], ItemFeatures[:,j]), 2)

                    # Regularization 
                    for w in range(features):
                        MSE += normaliz * ( pow(UserFeatures[i][w],2) + pow(ItemFeatures[w][j],2))

        RMSE = math.sqrt(MSE/count)

        if (verbose):
            print("Epoch: ", epoch, "\nRMSE: ", RMSE ,"\n__________________________\n")

        # Stopping Condition as suggested in the course notes
        if (RMSE>bestRMSE):
            break;

        bestRMSE = RMSE

        MatrixReversi = dot(UserFeatures, ItemFeatures)

    return MatrixReversi


# Connect to the database to get the data
import mysql.connector
auctionDB = mysql.connector.connect(
    host="localhost", 
    user="root", 
    password="rb16bhonda", 
    database="auctionDB"
)

# Fetch the three required tables
cursor = auctionDB.cursor()
cursor.execute("SELECT * FROM UserData")
userData = cursor.fetchall()
cursor.execute("SELECT * FROM Users")
users = cursor.fetchall()
cursor.execute("SELECT * FROM Items")
items = cursor.fetchall()

# Dictionary to keep search to O(1)
userIDs = {}
i=0
for user in users:
    userIDs[user[0]]=i
    i+=1

# Keep id and availability here
itemIDs = {}
itemList = []
available = []
i=0
for item in items:
    itemIDs[item[0]]= (i)
    itemList.append(item[0])
    available.append(item[12])
    i+=1

# Initialisation of the Ratings Matrix
Ratings = np.zeros((len(users), len(items)), dtype=np.double)

# Add the Ratings that come from the user history
for ratingData in userData:
    row = userIDs[ ratingData[5] ]
    column = itemIDs[ ratingData[4] ]
    Ratings[row][column] = ratingData[1]

# Calculate the predicted ratings for uknown elements
PredictedRatings = matrixFactorisation(Ratings, verbose=True)

for i in range(len(userIDs)):
    for j in range(len(itemIDs)):
        
        # Only keep the Unknown elements and those that are still Available and not theirs
        if Ratings[i][j]>0 or available[j] != 'AVAILABLE' or items[j][16] == users[i][0]:
            # By making the known in predicted 0
            PredictedRatings[i][j]=0

top = 6

# If the item pool is less than 6 keep just the top len
if (len(itemIDs)<6):
    top = len(itemIDs)

# Remove past recommendations
cursor.execute("TRUNCATE TABLE UserTops")

for user in userIDs:

    # Get their top recommendations
    myPersonalRecommendations = PredictedRatings[userIDs[user],:].argsort()[::-1][:top]

    # And fill in the extreme case the rest with zeroes
    if (len(itemIDs)<6):
        for i in range(6-len(itemIDs)):
            myPersonalRecommendations = np.append(myPersonalRecommendations, 0)

    stmt = "INSERT INTO UserTops (p1, p2, p3, p4, p5, p6, UserId) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    vals =  (itemList[myPersonalRecommendations[0]], itemList[myPersonalRecommendations[1]],
            itemList[myPersonalRecommendations[2]], itemList[myPersonalRecommendations[3]],
            itemList[myPersonalRecommendations[4]], itemList[myPersonalRecommendations[5]], user)

    cursor.execute(stmt, vals)
    auctionDB.commit()