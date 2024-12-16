const { test, expect } = require ("@playwright/test")
const { Ajv } = require("ajv");
const { request } = require("http");
const ajv = new Ajv()


// Test Case 1 GET
test('TC-1 GET User', async ({request}) => {
    const response = await request.get('https://reqres.in/api/users/12');

    expect(response.status()).toBe(200)

    const responseData = await response.json()
    const url = "https://reqres.in/img/faces/12-image.jpg"
    
    expect(responseData.data.id).toBe(12)
    expect(responseData.data.email).toBe("rachel.howell@reqres.in")
    expect(responseData.data.first_name).toBe("Rachel")
    expect(responseData.data.last_name).toBe("Howell")
    expect(responseData.data.avatar).toBe(url)

    const valid = ajv.validate(require('./JSON_Schema/GET-User.json'), responseData)

    if(!valid){
        console.log("Ajv Validation Error:", ajv.errorsText());
    }; 
 
    expect(valid).toBe(true);
});


// Test Case POST User
test('TC-2 POST User', async ({request}) => {
    const body = {
        name: "morpheus",
        job: "leader"
    };

    const response = await request.post('https://reqres.in/api/users', {
        data: body
    });

    const responseData = await response.json()

    expect(response.status()).toBe(201);

    expect(responseData).toHaveProperty('name', body.name);
    expect(responseData).toHaveProperty('job', body.job);
    expect(responseData).toHaveProperty('id');
    expect(responseData).toHaveProperty('createdAt');

    expect(typeof responseData.id).toBe('string');
    expect(responseData.id).not.toBe('');

    expect(typeof responseData.createdAt).toBe('string');
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    expect(iso8601Regex.test(responseData.createdAt)).toBeTruthy(); 

    const valid = ajv.validate(require('./JSON_Schema/POST-User.json'),responseData)

    if(!valid){
        console.log("Ajv Validation Error:", ajv.errorsText());
    };

    expect(response.ok).toBeTruthy();
    
});

//Test Case 3 DELETE
test('TC-3 DELETE User', async ({ request }) => {
    const response = await request.delete('https://reqres.in/api/users/');
    
    expect([204]).toContain(response.status());

    let responseData = {};
    if (response.status() !== 204) {
        responseData = await response.json();
    }

    expect(responseData).toEqual({}); 
});

//Test Case 4 PUT
test('TC-4 PUT User', async ({ request }) => {
    const body = {
        name: "morpheus",
        job: "zion resident"
    }

    const response = await request.put('https://reqres.in/api/users/', {
        data: body
    });

    const responseData = await response.json()
    expect(response.status()).toBe(200);

    expect(responseData).toHaveProperty('name', body.name);
    expect(responseData).toHaveProperty('job', body.job);
    expect(responseData).toHaveProperty('updatedAt');

    expect(typeof responseData.updatedAt).toBe('string');
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    expect(iso8601Regex.test(responseData.updatedAt)).toBeTruthy(); 
    
    const valid = ajv.validate(require('./JSON_Schema/PUT-User.json'),responseData)

    if(!valid){
        console.log("Ajv Validation Error:", ajv.errorsText());
    };

    expect(response.ok).toBeTruthy();
})
