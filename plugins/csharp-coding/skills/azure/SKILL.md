---
name: azure
description: 'Azure SDK for .NET integration patterns — credentials, client registration, and Storage, Service Bus, Key Vault, App Configuration, and Cosmos DB clients. Use when: adding an Azure service to a C# project, authenticating to Azure from .NET, or registering Azure SDK clients in DI. DO NOT USE FOR: provisioning Azure infrastructure, Azure resources in an Aspire AppHost (aspire).'
---

# Azure SDK for .NET

- Authenticate with Microsoft Entra ID through `Azure.Identity` — a token credential for every
  client, and no account key, connection string, or SAS in code or config.
- Use `DefaultAzureCredential` for local development and a deterministic credential in
  production: `ManagedIdentityCredential`, or `DefaultAzureCredential` with
  `AZURE_TOKEN_CREDENTIALS=ManagedIdentityCredential` (Azure.Identity 1.16+; Aspire 13 sets it
  on Container Apps and App Service). Build one credential and reuse it for every client.
- Register each client once, as a singleton: under Aspire through its client integration
  (`Aspire.Azure.*`, added with `aspire add`); otherwise through `AddAzureClients`
  (`Microsoft.Extensions.Azure`).
- Use `Azure.*` packages over legacy `Microsoft.Azure.*` ones, except the current official
  packages that still carry the old prefix: `Microsoft.Azure.Cosmos` and
  `Microsoft.Azure.AppConfiguration.AspNetCore`.
- Verify an SDK signature you are unsure of with [../microsoft-code-reference/SKILL.md](../microsoft-code-reference/SKILL.md).

```csharp
TokenCredential credential = builder.Environment.IsProduction()
    ? new ManagedIdentityCredential(ManagedIdentityId.SystemAssigned)
    : new DefaultAzureCredential();

builder.Services.AddAzureClients(clients =>
{
    clients.UseCredential(credential);
    clients.AddBlobServiceClient(new Uri("https://<account>.blob.core.windows.net"));
    clients.AddServiceBusClientWithNamespace("<namespace>.servicebus.windows.net");
    clients.AddSecretClient(new Uri("https://<vault>.vault.azure.net/"));
});
builder.Services.AddSingleton(new CosmosClient("<account-endpoint>", credential));
builder.Configuration.AddAzureAppConfiguration(o => o.Connect(new Uri("https://<store>.azconfig.io"), credential));
```
