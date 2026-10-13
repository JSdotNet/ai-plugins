---
name: azure
description: 'Azure SDK for .NET integration patterns — credentials, client registration, and Storage, Service Bus, Key Vault, App Configuration, and Cosmos DB clients. Use when: adding an Azure service to a C# project, authenticating to Azure from .NET, or registering Azure SDK clients in DI. DO NOT USE FOR: provisioning Azure infrastructure, Azure resources in an Aspire AppHost (aspire).'
---

# Azure SDK for .NET

Integrate Azure services into C# .NET projects using the official Azure SDK.

## Core Principles

- Use the `Azure.Identity` package for all authentication — never hardcode credentials.
- Use `DefaultAzureCredential` for local development and a deterministic credential in
  production: `ManagedIdentityCredential`, or `DefaultAzureCredential` with
  `AZURE_TOKEN_CREDENTIALS=ManagedIdentityCredential` (Azure.Identity 1.16+; Aspire 13 sets it on
  Container Apps and App Service).
- Use `Azure.*` SDK packages over legacy `Microsoft.Azure.*` libraries. The exceptions are the
  current official packages that still carry the old prefix: `Microsoft.Azure.Cosmos` and
  `Microsoft.Azure.AppConfiguration.AspNetCore`.
- Register SDK clients as singletons via dependency injection.
- Apply `CancellationToken` to all SDK calls.

## Authentication

```csharp
// Managed identity in production, developer tools (VS, CLI) locally
TokenCredential credential = builder.Environment.IsProduction()
    ? new ManagedIdentityCredential(ManagedIdentityId.SystemAssigned)
    : new DefaultAzureCredential();

// Register in DI, reusing the one credential for every client
builder.Services.AddSingleton(new BlobServiceClient(
    new Uri("https://<account>.blob.core.windows.net"),
    credential));
```

The snippets below reuse this `credential`.

## Common Integrations

### Azure Blob Storage

```bash
dotnet add package Azure.Storage.Blobs
```

```csharp
var client = new BlobServiceClient(new Uri("https://<account>.blob.core.windows.net"), credential);
var container = client.GetBlobContainerClient("my-container");
await container.UploadBlobAsync("file.txt", stream, cancellationToken);
```

### Azure Service Bus

```bash
dotnet add package Azure.Messaging.ServiceBus
```

```csharp
await using var client = new ServiceBusClient("<namespace>.servicebus.windows.net", credential);
var sender = client.CreateSender("my-queue");
await sender.SendMessageAsync(new ServiceBusMessage("hello"), cancellationToken);
```

### Azure Key Vault

```bash
dotnet add package Azure.Security.KeyVault.Secrets
```

```csharp
var kvClient = new SecretClient(new Uri("https://<vault>.vault.azure.net/"), credential);
var secret = await kvClient.GetSecretAsync("my-secret", cancellationToken: cancellationToken);
```

### Azure App Configuration

```bash
dotnet add package Microsoft.Azure.AppConfiguration.AspNetCore
```

```csharp
builder.Configuration.AddAzureAppConfiguration(options =>
    options.Connect(new Uri("https://<store>.azconfig.io"), credential));
```

### Cosmos DB

```bash
dotnet add package Microsoft.Azure.Cosmos
```

```csharp
builder.Services.AddSingleton(new CosmosClient(
    "<account-endpoint>",
    credential));
```

## Best Practices

- Use `Azure.Core.Pipeline` retry policies (built-in by default in all Azure SDK clients).
- Log SDK activity with `AzureEventSourceListener` for diagnostics.
- Verify SDK method signatures before implementation with the `microsoft-code-reference` skill or `https://learn.microsoft.com/dotnet/azure/`.
- Validate SDK versions with `dotnet list package --outdated`.

## Reference

- Azure SDK for .NET: `https://learn.microsoft.com/en-us/dotnet/azure/`
- Azure Identity docs: `https://learn.microsoft.com/en-us/dotnet/api/azure.identity`
- Credential best practices: `https://learn.microsoft.com/dotnet/azure/sdk/authentication/best-practices`
