# Zain Ali Syed 2024
# Code to represent project DABBA, for GDSCHacks 2024
# Code Written: May 4th - May 5th

# Purpose: To represent how we can use physical systems along with software to create contracts to the blockchain
# This following code demonstrates how a simple button and LCD monitor can streamline a voting system to prevent issues such as rigging
# The blockchain of course being a failsafe which helps us prevent against unauthorized changes

# THIS PORTION OF THE CODE REPRESENTS THE COMMUNICATION BETWEEN 2 CLASSES AND ALL THE PHYSICAL RASPBERRY PI WORK

# import statements
import board, time, digitalio
import hashlib

# Relevant Pin Assignments
#----------------------------------

# Pins for LEDs
redPin = board.GP21
bluePin = board.GP20
greenPin = board.GP19
yellowPin = board.GP18

# Pins for Buttons
rButtonPin = board.GP10
bButtonPin = board.GP11
gButtonPin = board.GP12
yButtonPin = board.GP13
submitButtonPin = board.GP26

#----------------------------------


# Initiliazing Inputs and Outputs
redLed = digitalio.DigitalInOut(redPin)
redLed.direction = digitalio.Direction.OUTPUT
redButton = digitalio.DigitalInOut(rButtonPin)
redButton.switch_to_input(pull = digitalio.Pull.UP)

blueLed = digitalio.DigitalInOut(bluePin)
blueLed.direction = digitalio.Direction.OUTPUT
blueButton = digitalio.DigitalInOut(bButtonPin)
blueButton.switch_to_input(pull = digitalio.Pull.UP)

greenLed = digitalio.DigitalInOut(greenPin)
greenLed.direction = digitalio.Direction.OUTPUT
greenButton = digitalio.DigitalInOut(gButtonPin)
greenButton.switch_to_input(pull = digitalio.Pull.UP)

yellowLed = digitalio.DigitalInOut(yellowPin)
yellowLed.direction = digitalio.Direction.OUTPUT
yellowButton = digitalio.DigitalInOut(yButtonPin)
yellowButton.switch_to_input(pull = digitalio.Pull.UP)

submitButton = digitalio.DigitalInOut(submitButtonPin)
submitButton.switch_to_input(pull = digitalio.Pull.UP)

# Other relevant variables and functions
votersNames = {} # Using a dictionary to store Key/Value pairs which are prone to change
candidates = ("Java" , "C#" , "Python" , "JavaScript") # Using a tuple because we don't want elements to change
currentVote = None
bPressed = False
counter = 0 # used to track indexes to avoid duplicates (indexes not manually inputted, rather tracked digitally)

# This class represents each block in the blockchain. Each block should have an index, a timestamp, data, the previous hash (of the previous block), and a hash
# For the sake of this demonstration, having a timestamp is not necessary. We know that the Blockchain uses hashing, so this is very hashing heavy
class Block:
    
    def __init__ (self, index, data):
        self._index = index
        self._data = data
        self._hash = self.hCalculate() # hCalculate is a method I defined for hashing, to find the hash value
        
    def hCalculate (self): # essentially takes all our necessary values and groups them into a string, the hashvalue of this complex string is much more unique than that of a single item
        hash_input = str(self._index) + str(self._data)
        return hash(hash_input)
    
    # Getters
    def getIndex(self):
        return self._index

    def getData(self):
        return self._data

    def getPrevious_hash(self):
        return self._previousHashValue

    # We do not need setters since this is the blockchain! Things cannot be changed after being added! Thus, the ONLY way to add values to a block is through the initial creating of the block
    # In Real-World terms, this would translate to the initial signing of the contract, ensuring that the blocks cannot be tampered with!


# THIS CLASS IS USED TO REPRESENT THE BLOCKCHAIN. CircuitPython is finnicky so getting it to communicate with the real
# BlockChain is challenging (yet still possible). But this is a simplified model, where I will use given Data Structures
# To represent how the block chain acts and works. This will then represent the safe communication of infortmation
# Between the blockchain and the Voting System

class Blockchain:
    
    def __init__(self):
        self.chain = [self.createGenesisBlock()] #Genesis Block is seen as the first block in the chain
        
    def createGenesisBlock(self):
        return Block(0, "Genesis Block")
    
    def getLastBlock(self):
        return self.chain[-1]
    
    def addBlock(self, block):
        block.previousHashValue = self.getLastBlock().hCalculate # takes the last block and sets its hash as previousHash for this block
        self.chain.append(block)
        
    #  Of course, no need for deletion methods, as we do not delete from the chain!
    
    def printBlockChain(self):
    
        for block in self.chain:
            index = str(block.getIndex())
            data = block.getData()
            hCalculate = str(block.hCalculate())

            # Ensuring it is centered from both sides keeping consistency and neatness
            padding_index = (10 - len(index)) // 2
            padding_data = (20 - len(data)) // 2
            padding_hCalculate = (10 - len(hCalculate)) // 2
            formatted_index = " " * padding_index + index + " " * padding_index
            formatted_data = " " * padding_data + data + " " * padding_data
            formatted_hCalculate = " " * padding_hCalculate + hCalculate + " " * padding_hCalculate
            total_width = 2 + len(formatted_index) + len(formatted_data) + len(formatted_hCalculate)
            padding_separator = (total_width - 2) // 2

            # Print centered strings
            print("[ {}, {}, {} ]".format(formatted_index, formatted_data, formatted_hCalculate))
            print("\n" + " " * padding_separator + "|\n")

        

blockchain = Blockchain()
counter += 1


def findNumOfVotes(dictionary, target): # Function to cotunt how many votes a given candidate has
    count = 0
    for vote in dictionary.values():
        if vote == target:
            count += 1
    return count


# --------- Voting System ---------

while counter <= 5:
    
    userName = input("Enter your name: ")
    print("Hello " + userName + "! Please use the device to cast your vote!")
    voteSubmitted = False
    bPressed = False
        
    while voteSubmitted == False:
    
        time.sleep(0.075)
    
        if redButton.value == False: # With pushbuttons, a pushed status evaluates to false instead of true
            redLed.value = True
            blueLed.value = False
            greenLed.value = False
            yellowLed.value = False
            bPressed = True
            currentVote = candidates[0]
            
        elif blueButton.value == False: 
            redLed.value = False
            blueLed.value = True
            greenLed.value = False
            yellowLed.value = False
            bPressed = True
            currentVote = candidates[1]
        
        elif greenButton.value == False: 
            redLed.value = False
            blueLed.value = False
            greenLed.value = True
            yellowLed.value = False
            bPressed = True
            currentVote = candidates[2]

        elif yellowButton.value == False: 
            redLed.value = False
            blueLed.value = False
            greenLed.value = False
            yellowLed.value = True
            bPressed = True  
            currentVote = candidates[3]
        
        elif submitButton.value == False:
            redLed.value = False
            blueLed.value = False
            greenLed.value = False
            yellowLed.value = False
        
            if bPressed == False:
                print("Please choose a Candidate before submitting!")
            else:
                
                if userName in votersNames:
                    print("You have already voted! Every voter only get's one choice which is final!")
                else:
                    votersNames[userName] = currentVote
                    print("Congratulations! You have voted for: " + currentVote)
                    blockchain.addBlock(Block(counter , userName + " has voted for: " + currentVote))
                    counter +=1
                    
                    
            
                voteSubmitted = True
                
                print("Here are the current standings!")
                print(candidates[0] + " has: " + str(findNumOfVotes(votersNames, candidates[0])))
                print(candidates[1] + " has: " + str(findNumOfVotes(votersNames, candidates[1])))
                print(candidates[2] + " has: " + str(findNumOfVotes(votersNames, candidates[2])))
                print(candidates[3] + " has: " + str(findNumOfVotes(votersNames, candidates[3])))
                
                time.sleep(2)
                currentVote = None
                print("\n\n\n")


print("All 5 people have voted! Now we will look at the Blockchain!\n\n")
blockchain.printBlockChain()