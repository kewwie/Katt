
![system_architeture](system_architecture_diagram.png)

# AppModule
is used to link all the other modules, controllers and services to the main file.

## Imports
Modules [JoinModule, AuthModule]  
Controllers [AppController]  
Services [AppService]  

# AppController
Is used to add/manage routes and then uses AppService to run a function which does the actuall stuff

## Imports
Service [AppService]

# AppService 
Is a class of function which can be called in the AppController when routes are triggered

# AuthModule
is used to link the controllers and services to for auth.

## Imports
Controllers [AuthController]  
Services [AuthService]

# AuthController
used for auth routes and then calls the functions in AuthService which runs the code 

## Imports
Service [AuthService]

## AuthService
The behind code for the auth part of the api

# Login 
Is a typeorm entity with values used to know which values to update or set in database

# AuthUser 
Is a typeorm entity with values used to know which values to update or set in database

# Guild 
Is a typeorm entity with values used to know which values to update or set in database

# DataSource
Is a typeorm datasource which is used to connect to the database

# Env 
Which is used to get the env value from .env file
