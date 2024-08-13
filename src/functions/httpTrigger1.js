const { app } = require('@azure/functions');
const Handlebars = require('handlebars');
const { EmailClient } = require("@azure/communication-email");
const fs = require('fs');
const path = require('path');

const connectionString = "";
const client = new EmailClient(connectionString);

app.http('httpTrigger1', {
    methods: ['POST'],
    handler: async (request, context) => {

        const requestData = await request.json();
        const subject = requestData.subject;
        //const template = requestData.template;
        const dataTemplate = requestData.dataTemplate;

        const templatePath = path.join(__dirname, 'registro.html');
        const source = fs.readFileSync(templatePath, 'utf-8');
        const template = Handlebars.compile(source);
        const html = template({ name: "Maria" });


        const emailMessage = {
            senderAddress: "",
            content: {
                subject: "Correo electrónico de prueba",
                html: html,
            },
            recipients: {
                to: [{ address: "angaritagerman@hotmail.com" }],
            },
        };

        const poller = await client.beginSend(emailMessage);
        const result = await poller.pollUntilDone();
        return { body: `email sent successfully` };
    }
});
