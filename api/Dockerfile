FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY api/api.csproj ./api/
RUN dotnet restore ./api/api.csproj

COPY api/. ./api/

WORKDIR /src/api

RUN dotnet publish "api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5070
ENTRYPOINT ["dotnet", "api.dll"]