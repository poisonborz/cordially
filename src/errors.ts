
export const errors = [
    {
        code: 'no_guests_added',
        message: 'There are no guests added yet to the database',
        status: 422
    },
    {
        code: 'invalid_auth',
        message: 'Invalid authorising code provided',
        status: 400
    },
    {
        code: 'supplied_user_invalid',
        message: 'Supplied user invalid',
        status: 400
    },
    {
        code: 'guest_retrieval_error',
        message: 'There was an error processing the guest info',
        status: 422
    },
    {
        code: 'no_permission',
        message: 'No permissions to execue the request',
        status: 403
    },
    {
        code: 'invalid_guest_prop',
        message: 'Invalid guest property specified',
        status: 400
    },
    {
        code: 'req_params_missing',
        message: 'Required parameter(s) not specified',
        status: 400
    },
    {
        code: 'param_invalid_value',
        message: 'Parameter has invalid value',
        status: 400
    },
    {
        code: 'param_value_smaller',
        message: 'Value smaller than maximum allowed for parameter',
        status: 400
    },
    {
        code: 'param_value_larger',
        message: 'Value larger than maximum allowed for parameter',
        status: 400
    },
    {
        code: 'param_only_number',
        message: 'Only number values allowed for parameter',
        status: 400
    },
    {
        code: 'param_no_null',
        message: 'No null value allowed for parameter',
        status: 400
    },
    {
        code: 'internal_error',
        message: 'An unexpected internal error has occured',
        status: 500
    }
]
