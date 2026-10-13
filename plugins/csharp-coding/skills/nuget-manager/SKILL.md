---
name: nuget-manager
description: 'Add, remove, update, and list NuGet packages in .NET projects and solutions with the dotnet CLI, Central Package Management aware. Use when: adding, removing, or upgrading a NuGet package, bumping a package version, or listing outdated packages.'
---

# NuGet Manager

Manage NuGet packages safely using the `dotnet` CLI.

## Rules

- Add and remove packages with the CLI, never by hand-editing a new reference. .NET 10 SDK and
  later: `dotnet package add` / `dotnet package remove`; every SDK: `dotnet add package` /
  `dotnet remove package`.
- When the solution has a `Directory.Packages.props` (Central Package Management), versions
  live only there: the CLI writes `<PackageVersion>` there and a version-less
  `<PackageReference>` in the project. Bump a version in `Directory.Packages.props`, never in a
  `.csproj`.
- Without CPM, bump a version by re-adding the package with `--version`, or by editing the
  `Version` attribute of its `<PackageReference>` in the `.csproj`.
- Always run `dotnet restore` after version changes to validate the dependency graph.

## Common Operations

The noun-first form needs the .NET 10 SDK; the verb-first form works on every SDK.

### Add a Package

```bash
dotnet package add <PackageName> --version <version> --project <project>
dotnet add <project> package <PackageName> --version <version>
```

### Remove a Package

```bash
dotnet package remove <PackageName> --project <project>
dotnet remove <project> package <PackageName>
```

### List Outdated Packages

```bash
dotnet package list --outdated
dotnet list package --outdated
```

### Update a Package Without CPM

```bash
dotnet package update <PackageName>                       # .NET 10 SDK and later
dotnet add <project> package <PackageName> --version <version>
```

Or edit `<PackageReference Include="..." Version="..." />` in the `.csproj`, then:

```bash
dotnet restore
dotnet build
dotnet test
```

### Central Package Management (`Directory.Packages.props`)

If the solution uses CPM, update the version in `Directory.Packages.props`, not in individual `.csproj` files:

```xml
<PackageVersion Include="PackageName" Version="x.y.z" />
```

## Validation

After any package change:

```bash
dotnet restore
dotnet build
dotnet test
```

Resolve all warnings about deprecated or incompatible packages before finalizing.
