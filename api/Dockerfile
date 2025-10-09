FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["CodeClashApi.sln", "./"]
COPY ["api/api.csproj", "api/"]
COPY ["api.tests/api.tests.csproj", "api.tests/"]

RUN dotnet restore "CodeClashApi.sln"

COPY . .

WORKDIR "/src/api"
RUN dotnet publish "api.csproj" -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "api.dll"]