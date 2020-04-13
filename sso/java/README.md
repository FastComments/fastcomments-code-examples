This is a Sprint Boot MVC application for demonstrating the FastComments SSO integration, using gradle for dependencies.
It's developed using JDK 13.

Run the SsoDemoApplication class, and then visit http://localhost:8080/demo to see it in action.

The SSO encryption logic is in DemoController while the structures are defined in the "domain" package.

To test with your actual production keys/values:
1. Change the "demo" tenant id to your own, in resources/templates/demo.html
2. Change the api secret to your own, in DemoController.

For setup/run help, see HELP.md
