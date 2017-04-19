#!/bin/bash
set -e
dotnet restore
dotnet test WebApplication.tests/WebApplication.tests.csproj
rm -rf $(pwd)/publish
dotnet publish WebApplication -c Release -o $(pwd)/publish