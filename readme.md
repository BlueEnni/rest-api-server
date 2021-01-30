# Webprogramming project DHBW Heidenheim

## Installation manual:

1. Install xampp or a mariadb server on your system. After that create a database called mariadb.
  
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
    sudo wget https://github.com/BlueEnni/rest-api-server/archive/1.2.zip; mkdir Code; mv ./rest-api-server-1.2.zip ./Code/; cd Code/; unzip rest-api-server-1.2.zip
  ```

3. Now go into the code folder until you are on the same root level as the app.js file is and use 'npm install' to get all required dependencies:

  **Linux:**

  ```
		cd ./rest-api-server-1.1/; sudo npm install
	
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
		
		cd Code/rest-api-server-1.1/frontend/; npm install -g @angular/cli -n; npm install; ng serve 
  ```
---

## Software Information

- GUI is reachable via http://localhost:4200
- The Backend/API is reachable via http://localhost:3000


1. rates upload via postman or any other rest capable system:
    - ***post*** request to:
	http://localhost:3000/ratesupload
	
    ```
      body: form-data
		    key: csv
		    value: <your file path>
    ```
	
2. rates request from others e.g. Check24:
    - ***get*** request to:
	http://localhost:3000/rates
	
	
3. request a specific rate:
    - ***get*** request to:
	http://localhost:3000/rates/<rate-id>


4. users request:
    - ***get*** request to:
	http://localhost:3000/users
	

5. request a specific user:
    - ***get*** request to:
	http://localhost:3000/users/<user-id>
	
	
6. error handling for non existent api-url's

---

## Additional features:
  - registration
  - login (with form -> to api)
    - token for identification (via cookie)
  - logout
    - deleting all cookies
  - rates overview
    - displays all rates with pagination
  - rates bookmark - with cookies
    - through search and rates overview it is possible to select rates in order to save those temporarily in your browser through cookies
    - by unselecting them in the myrates subpage or in the rates subpage a new cookie without the selected ones is replacing the previous cookie
  - rates search:
    - by zip-code
      - filtering by zip-code displays all rates for that zip-code sorted my 'fixkosten'
    - by amount of electricity needed per month
      - filtering for the amount needed per month by calculating the total costs per month for the entered electricity amount (in an ascending order)
        - the total costs is only being displayed if a amount of electricity is being entered
    > -->forwards to the overview subpage upon submit with the applied filters