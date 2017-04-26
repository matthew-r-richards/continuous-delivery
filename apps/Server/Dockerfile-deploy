FROM microsoft/aspnetcore

COPY ./publish /usr/src/server-app
WORKDIR /usr/src/server-app

EXPOSE 80

ENTRYPOINT ["dotnet", "WebApplication.dll"]