---
name: nuget-manager
description: 'Add, remove, update, and list NuGet packages in .NET projects and solutions with the dotnet CLI, Central Package Management aware. Use when: adding, removing, or upgrading a NuGet package, bumping a package version, or listing outdated packages.'
---

# NuGet Manager

1. Detect Central Package Management (CPM): a `Directory.Packages.props` at or above the
   project. Under CPM, versions live only there.
2. Add and remove packages with the CLI, never by hand-editing a new reference:
   `dotnet package add <Id> --version <v> --project <project>` and
   `dotnet package remove <Id> --project <project>` on the .NET 10 SDK and later;
   `dotnet add <project> package <Id> --version <v>` and `dotnet remove <project> package <Id>`
   on every SDK. Under CPM the CLI writes `<PackageVersion>` to `Directory.Packages.props` and a
   version-less `<PackageReference>` to the project.
3. Bump a version under CPM in `<PackageVersion Include="<Id>" Version="x.y.z" />` in
   `Directory.Packages.props`, never in a `.csproj`. Without CPM, re-add the package with
   `--version`, run `dotnet package update <Id>` (.NET 10 SDK), or edit the `Version` attribute
   of its `<PackageReference>`.
4. List outdated packages with `dotnet package list --outdated` (.NET 10 SDK) or
   `dotnet list package --outdated`.
5. After every change run, in order, stopping at the first failure: `dotnet restore`, then
   `dotnet build`, then `dotnet test`.
6. Resolve every NuGet warning restore and build report — a downgrade (`NU1605`), a
   vulnerable package (`NU1901`–`NU1904`), a deprecated or incompatible one — before reporting
   the change done.
