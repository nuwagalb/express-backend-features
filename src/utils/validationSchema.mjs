export const createUserValidationSchema = {
    //field to validate
    username: {
        //functions to run on field being validate
        notEmpty: {
            errorMessage: "Username cannot be empty"
        },
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: "Username must be at least 5 characters with max of 32 characters"
        },
        isString: {
            errorMessage: "Username must be a string" 
        }
    },
    displayName: {
        notEmpty: true //since it has no options that will be passed to it
    }
};

export const getUsersValidationSchema = {
    //query parameter to validate
    filter: {
        //functions to run on the query parameter
        isString: true,
        notEmpty: {
            errorMessage: "Must not be empty"
        },
        isLength: {
            options: {
                min: 3,
                max: 10
            },
            errorMessage: "Must be at least 3 -10 characters"
        }
    }
};