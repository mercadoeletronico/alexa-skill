// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const axios = require('axios');

const TEM_PENDENCIAHandler = { // Consultar pendencia dar return do numero de pendencias
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TEM_PENDENCIA';
    },
    async handle(handlerInput) {

        const attributes = handlerInput.attributesManager.getSessionAttributes();

        const { data } = await axios.post("https://me-alexa-api.herokuapp.com/tem_pendencia",{accessToken:attributes.accessToken})
        const speakOutput = JSON.stringify(data);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const DESCRIBE_PENDENCIAHandler = {// Consultar as pendencias dar return da descrição das pendencias numero comprador etc
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DESCRIBE_PENDENCIA';
    },
    async handle(handlerInput) {

        const attributes = handlerInput.attributesManager.getSessionAttributes();

        const { data } = await axios.get("https://me-alexa-api.herokuapp.com/describe_pendencia", {accessToken:attributes.accessToken})//receber frase [0] e numero pendencia [1]

    
        attributes.pendencia = data.id
        handlerInput.attributesManager.setSessionAttributes(attributes)

        //this.$session.$data.pendencia = data.id;
        return handlerInput.responseBuilder
            .speak(data.speak)
            .reprompt(data.speak)
            .getResponse();
    }
};

const APROVAR_PENDENCIAHandler = {// Aprovar pendencia
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'APROVAR_PENDENCIA';
    },
    async handle(handlerInput) {

        const attributes = handlerInput.attributesManager.getSessionAttributes();

        const { data } = await axios.post("https://me-alexa-api.herokuapp.com/aprovar", {pend:attributes.pendencia})//Link aprovar

        //this.$session.$data.pendencia = "";
        const speakOutput = data
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const RECUSAR_PENDENCIAHandler = {// Recusar pendencia
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RECUSAR_PENDENCIA';
    },
    async handle(handlerInput) {

        const attributes = handlerInput.attributesManager.getSessionAttributes();

        const { data } = await axios.post("https://me-alexa-api.herokuapp.com/recusar", { pend:attributes.pendencia})//Link recusar

        //this.$session.$data.pendencia = "";
        const speakOutput = data
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SABERMAIS_PENDENCIAHandler = {// Recusar pendencia
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SABERMAIS_PENDENCIA';
    },
    async handle(handlerInput) {

        const attributes = handlerInput.attributesManager.getSessionAttributes();

        const { data } = await axios.post("https://me-alexa-api.herokuapp.com/desc", { pend:attributes.pendencia})//Link recusar

        //this.$session.$data.pendencia = "";
        const speakOutput = data
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {

        let aToken = handlerInput.requestEnvelope.context.System.user.accessToken

        const attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.accessToken = aToken
        handlerInput.attributesManager.setSessionAttributes(attributes)

        const speakOutput = 'Olá, Bem vindo ao assistente do Mercado Eletrónico';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        TEM_PENDENCIAHandler,
        APROVAR_PENDENCIAHandler,
        RECUSAR_PENDENCIAHandler,
        SABERMAIS_PENDENCIAHandler,
        DESCRIBE_PENDENCIAHandler,
        IntentReflectorHandler // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();