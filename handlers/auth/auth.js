const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { httpErrorHandler } = require('middy/middlewares');
const createError = require('http-errors');

const commonMiddlewares = require('../../middlewares/commonMiddlewares');
const { response } = require('../../commons');
const { connectToDatabase } = require('../../db');

const User = require('../../models/user');

const hashPassword = (password) => {
  return bcrypt.hash(password, 10);
}

const validateHashedPassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
}

const generateAuthToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

const decodeAuthToken = (token) => {
  return jwt.decode(token, process.env.JWT_SECRET);
}

const generatePolicy = function(principalId, effect, resource) {
  const authResponse = {};
  
  authResponse.principalId = principalId;
  if (effect && resource) {
      const policyDocument = {};
      policyDocument.Version = '2012-10-17'; 
      policyDocument.Statement = [];
      const statementOne = {};
      statementOne.Action = 'execute-api:Invoke'; 
      statementOne.Effect = effect;
      statementOne.Resource = resource;
      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
  }
  
  return authResponse;
}

const register = async (event) => {
  try {    
    await connectToDatabase();
    
    const { body } = event;
    
    const hashedPassword = await hashPassword(body.password);

    const user = await User.create({
      ...body,
      password: hashedPassword
    });

    const authToken = generateAuthToken({ _id: user._id });

    return response(201, 'Registration successful', {
      Authorization: `Bearer ${authToken}`
    });
  } catch (error) {
    return response(error.statusCode, error.message); 
  }
}

module.exports.register = commonMiddlewares(register)
  .use(httpErrorHandler())

const login = async (event) => {
  try {    
    await connectToDatabase();
    
    const { body } = event;
    
    const user = await User.findOne({ email: body.email });

    if(user && await validateHashedPassword(body.password, user.password)) {
      const authToken = generateAuthToken({ _id: user._id });

      return response(201, 'Login successful', {
        Authorization: `Bearer ${authToken}`
      });
    } else {
      throw createError.Unauthorized('Invalid email address or password');
    }
  } catch (error) {
    return response(error.statusCode, error.message); 
  }
}

module.exports.login = commonMiddlewares(login)
  .use(httpErrorHandler())

const authValidate = async (event) => {
  try {
    const { authorizationToken} = event; 

    if(!authorizationToken) 
      return generatePolicy('undefined', 'Deny', event.methodArn);

    const decodedToken = decodeAuthToken(authorizationToken.split(' ')[1]);
    
    return generatePolicy(decodedToken._id, 'Allow', event.methodArn);
  } catch (error) {
    return generatePolicy('undefined', 'Deny', event.methodArn);
  }
}

module.exports.authValidate = authValidate;