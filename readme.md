# Webprogramming project DHBW Heidenheim

## Installation manual (Ubuntu):

1. Install a mariadb server on your system. After that create a database called mariadb.
  
  **Linux:**
  
  ```
		sudo su
		
		sudo dpkg --configure –a; apt-get -y update; apt-get -y install mariadb-server; mysql -u root;
  ``` 
	
    
		CREATE DATABASE mariadb CHARACTER SET = 'utf8mb4'  COLLATE = 'utf8mb4_unicode_ci'; set password for 'root'@'localhost' = password('root'); flush privileges; exit;

  ```	
		apt-get -y install nodejs npm; npm install -g n; n 10.19.0; PATH="$PATH"
  ```	
		
2. Now create a 'Code-Folder' and move your downloaded zip-file into it (optional) and unzip it afterwards:

  **Linux:**
  
  ```
    sudo wget https://github.com/BlueEnni/rest-api-server/archive/1.5.zip;
    
    mkdir Code; mv ./1.5.zip ./Code/; cd Code/; unzip 1.5.zip
  ```

3. Now go into the code folder until you are on the same root level as the app.js file is and use 'npm install' to get all required dependencies:

  **Linux:**

  ```
		cd ./rest-api-server-1.5/; sudo npm install
	
  ```	

4. Now rename the .env.empty file to .env and enter db connection information:
	
  **Linux:**

  ```
		mv .env.empty ./.env; nano .env
  ```

*Connection data (can differ if you'll use your own db – located on a different device):*

  ```
		DB_HOST=localhost
		DB_USER=root
		DB_USER_PASSWORD=root
		DB_NAME=mariadb
	
  ```
  
  Now press:
  ``` 
		ctrl+o (for save)
		Enter (for approving)
		ctrl+x (for exiting the editor)
  ```	

5. Now install the browser the application was tested on:
	
  **Linux:**

  ```
		sudo wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb; sudo apt install ./google-chrome-stable_current_amd64.deb
  ```

6. Now start the node backend-server with 'npm start':
	
  **Linux:**

  ```
		npm start
  ```

7. Open another terminal, switch to the frontend folder and install the angular cli:
	
  **Linux:**
		
  ```  
    sudo su
		
		cd ./Code/rest-api-server-1.5/frontend/; npm install -g @angular/cli -n; npm install; ng serve 
  ```
---

## Software Information

- GUI is reachable via http://localhost:4200
- The Backend/API is reachable via http://localhost:3000


1. rates-upload via postman or any other rest capable system:
    - ***post*** request to:
	http://localhost:3000/ratesupload
	
    ```
      body: form-data
		    key: csv
		    value: <your file path>
    ```


2. login:
    - ***post*** request to:
	http://localhost:3000/login

    ```
      body: raw/json
      {
		    "username": "<<username>>",
		    "password": "<<password>>"
      }
    ```


3. registration:
    - ***post*** request to:
	http://localhost:3000/signup

    ```
      body: raw/json
      {
		    "username": "<<username>>",
		    "password": "<<password>>",
        "email": "<<email>>",
        "firstName": "<<firstName>>",
        "lastName": "<<lastName>>"
      }
    ```


4. request all rates:
    - ***get*** request to:
	http://localhost:3000/rates/all
	
	
5. request all rates matching the request query (plz and energy amount):
    - ***get*** request to:
	http://localhost:3000/rates
    ```
      params/query:
      key(1): consumption
      value(1): <<energy amount per year>>
      key(2): zipCode
      value(2): <<zipCode>> 
    ```

	
6. request a specific rate:
    - ***get*** request to:
	http://localhost:3000/rates/:id


7. change a specific rate:
    - ***patch*** request to:
	http://localhost:3000/rates/:id
    ```
      body: raw/json
      {
		    "tarifName": "<<tarifName>>",
		    "plz": "<<plz>>",
        "fixkosten": "<<fixkosten>>",
        "variableKosten": "<<variableKosten>>"
      }
    ```   


8. delete a specific rate:
    - ***delete*** request to:
	http://localhost:3000/rates/:id


9. request all users:
    - ***get*** request to:
	http://localhost:3000/users
	

10. request a specific user:
    - ***get*** request to:
	http://localhost:3000/users/:userId


11. change a specific user:
    - ***patch*** request to:
	http://localhost:3000/users/:userId
    ```
      body: raw/json
      {
		    "username": "<<username>>",
		    "password": "<<password>>",
        "email": "<<email>>",
        "firstName": "<<firstName>>",
        "lastName": "<<lastName>>"
      }
    ``` 


12. delete a specific user:
    - ***delete*** request to:
	http://localhost:3000/users/:userId


13. request all orders:
    - ***get*** request to:
	http://localhost:3000/orders


13. request a specific order:
    - ***get*** request to:
	http://localhost:3000/orders/:orderId


14. submit an order:
    - ***post*** request to:
	http://localhost:3000/orders

    ```
      body: raw/json
      {
		    "rateId": "<<rateId>>",
		    "userId": "<<userId>>",
        "consumption": "<<consumption>>",
        "street": "<<street>>",
        "streetNumber": "<<streetNumber>>",
        "zipCode": "<<zipCode>>",
        "city": "<<city>>"
      }
    ```


15. change a specific order:
    - ***patch*** request to:
	http://localhost:3000/orders/:orderId

    ```
      body: raw/json
      {
		    "rateId": "<<rateId>>",
		    "userId": "<<userId>>",
        "consumption": "<<consumption>>",
        "street": "<<street>>",
        "streetNumber": "<<streetNumber>>",
        "zipCode": "<<zipCode>>",
        "city": "<<city>>"
      }
    ```


16. delete a specific order:
    - ***delete*** request to:
	http://localhost:3000/orders/:orderId


17. error handling for non existent api-url's

---

## Additional features:
  - registration
  - login (with form -> to api)
    - token for identification (via cookie)
  - logout
    - deleting all cookies
  - 'rates' overview
    - displays all rates with pagination
  - rates bookmark - with cookies
    - through the 'search' and 'rates' overview subpages it is possible to select rates in order to save those temporarily in your browser (with cookies)
    - by unselecting the rates in the 'myrates' subpage or in the 'rates' subpage, the old cookie is beeing replaced by a new cookie
  - rates search:
    - by 'zip-code'
      - filtering by zip-code displays all rates for that zip-code, sorted by 'fixkosten'
    - by 'amount of electricity needed per month'
      - filtering for the amount needed per month by calculating the 'total costs per month' for the entered 'electricity amount' (in an ascending order)
        - the 'total costs' is only being displayed if a 'amount of electricity' is being entered
    > -->forwards to the 'overview' subpage upon submit with the applied filters