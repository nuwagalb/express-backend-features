import { getUserByIdHandler, createUserHandler } from "../handlers/users.mjs";
import { mockUsers } from "../utils/constants.mjs";
import * as validator from "express-validator";
import * as helpers from "../utils/helpers.mjs";
import { User } from "../mongoose/schemas/user.mjs";

//mocking a method from a module
//we will mock the validationResults() that is imported
//from the express-validator module
//since the validationResult function returns an object
//that has the isEmpty() and array() functions on it, we
//also need to mock these functions
jest.mock("express-validator", () => ({
    validationResult: jest.fn(() => ({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{msg: "invalid Field"}]),
    })),
    matchedData: jest.fn(() => ({
        username: "test",
        password: "password",
        displayName: "test_name",
    }))
}))

//mock the request object
const mockRequest = {
    //this property is referenced from the request object
    //utilized in the getUserByIdHandler that is being 
    //tested
    findUserIndex: 1
};

// mock the response object
const mockResponse = {
    //sendStatus and send properties that are referenced on
    //the response object in the getUserByIdHandler, since
    //they are functions, we use jest.fn() to mock them out
    sendStatus: jest.fn(),
    send: jest.fn(),
    //the status property of the request object returns a
    //response object on which other response attributes can
    //be referenced
    status: jest.fn(() => mockResponse),
};

//mock the hashpassword function
jest.mock("../utils/helpers.mjs", () => ({
    hashPassword: jest.fn((password) => `hashed_${password}`),
}));

//mock the ES6 User Class
jest.mock("../mongoose/schemas/user.mjs"); 

// TEST SUITE FOR GETTING A SINGLE USER 
describe('get single users', () => {
    it('should get user by id', () => {
        //this is our function under test that takes in two 
        //arguments, the request and response for a given
        //endpoint. We will mock these request and response
        //objects to reflect the properties on them that our 
        //function under test will utilize
        getUserByIdHandler(mockRequest, mockResponse);
        //use this to verify that a function was called
        expect(mockResponse.send).toHaveBeenCalled();
        //use this to verify that a function was called with specific
        //parameters
        expect(mockResponse.send).toHaveBeenCalledWith(mockUsers[1]);
        //use this to verify that a function was called a given
        //number of times
        expect(mockResponse.send).toHaveBeenCalledTimes(1);

    });

    it("should call sendStatus with 404 when user not found", () => {
        //Start a new scenario/use case for the function that will
        //be tested.
        //Here are the new mocks for this use case, the mockResponse will
        //remain the same as in the previous test closure
        const copyMockRequest = {...mockRequest, findUserIndex: 100}
        getUserByIdHandler(copyMockRequest, mockResponse);
        expect(mockResponse.sendStatus).toHaveBeenCalled();
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
        expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
        expect(mockResponse.send).not.toHaveBeenCalled();
    });
});

// TEST SUITE FOR CREATING A USER
describe("create users", () => {
    const mockRequest = {};
    //test the **Handling Validation Results Section** within our 
    //CreateUserHandler function
    it("should return status of 400 when there are errors", async () => {
        await createUserHandler(mockRequest, mockResponse);
        //test to see that validatorResult function was called
        expect(validator.validationResult).toHaveBeenCalled();
        //test to see that validatorResult function was called with the request
        //object being it's argument
        expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
        //test to see that the response object was called with a status code of
        //400
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        //test to see that the send method was called on the response object
        expect(mockResponse.send).toHaveBeenCalledWith([{msg: "invalid Field"}]); 
    });


    // test the **Working with Validated Data Section** and the 
    // **Saving New User Details to Database**
    it("should return status 201 and the newly created user", async () => {
        //since in our createUserHandler function, the process of handling
        //the matchedData that was returned as a result of calling the validationResult
        //method occurs when the isEmpty() returns true, meaning no errors were
        //found in the validation process, then we need to handle this scenario where
        //isEmpty() returns true
        //this is how we handle this. This implementation will change the isEmpty fn that
        //we already mocked as "false" to be mocked as "true"
        jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => true),
        }));

        //to track a method call on a given instance of the User class, we can
        //do the following. In this example, we are tracking the "save" method to
        //have been called on the instance of the User Class
        const saveMethod = jest
            .spyOn(User.prototype, "save")
            //the value returned when the save method is called
            .mockResolvedValueOnce({
                id: 1,
                username: "test",
                password: "hashed_password",
                displayName: "test_name",
            })

        await createUserHandler(mockRequest, mockResponse);
        //test to see that matchedData was called
        expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
        //test to see that the hashPassword function from the helpers
        //module was called with a "password value" as it's argument
        expect(helpers.hashPassword).toHaveBeenLastCalledWith("password");
        //test to see that the hashPassword function returned a hashed
        //password value
        expect(helpers.hashPassword).toHaveReturnedWith("hashed_password");
        //test to see that the User object from mongoose was called with the
        //given data parameters as it's argument
        expect(User).toHaveBeenCalledWith({
            username: "test",
            password: "hashed_password",
            displayName: "test_name",
        });
        //test to see that the save method of the User class was called on
        //the instance of the User that was created
        //Option one:
        //expect(User.mock.instances[0].save).toHaveBeenCalled()
        //Option Two:
        expect(saveMethod).toHaveBeenCalled();
        
        //test to see that the status method was called with 201
        expect(mockResponse.status).toHaveBeenCalledWith(201);

        //test tp see tjat tje send method was called with the saved 
        //user details
        expect(mockResponse.send).toHaveBeenCalledWith({
                id: 1,
                username: "test",
                password: "hashed_password",
                displayName: "test_name",
        });
    });

    //test that a 400 status code is returned when the database fails to save
    //a given user
    it("send status 400 when the database fails to save a user", async () => {
        jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => true),
        }));

        const saveMethod = jest
        .spyOn(User.prototype, "save")
        //since the save method is an asynchronous operation, it returns a promise
        //and since the operation is an error, it returns the reject method of this
        //promise
        .mockImplementationOnce(() => Promise.reject("Failed to save user"));

        await createUserHandler(mockRequest, mockResponse);
        
        //test to see that the save method was called 
        expect(saveMethod).toHaveBeenCalled();

        //test tp see that the send method was called on the response object
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
    })
});

//TO DO: 
// Test Suite for authentication of a user using the local strategy
// 

/**
 * UNIT TEST
 * -> aim at testing a single function: ensure that this function
 *    actually does what it should be doing: test to see that the function
 *    is meeting the conditions that are set in it and finally test to see 
 *    that the function gives the expected outcome
 * -> test suites/ test closures
 */

/**
 * INTEGRATION AND END TO END TEST
 * -> Integration tests test flows in your application i.e creating a user and
 *    ensuring that this user can log into your application
 * -> Integration tests might be better in some scenarios because all you need
 *    to focus on is that things operations in your application work as expected
 *    i.e that if a given api endpoint is called, then it works as expected. It 
 *    is alot easier than the unit tests in some instances
 * 
 */