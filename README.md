# BioQuery App Extension

## Getting Started

### Prerequisites

The following dependencies must have already been installed on your machine:

- Node.js and npm
- PostgreSQL
- Apache HTTP Server

### Installing Node.js and npm

You can download Node.js and npm from [here](https://nodejs.org/en/download/). After installation, you can check the installed versions using the following commands:

```sh
node -v
npm -v
```

### Installing PostgreSQL

To install PostgreSQL on Ubuntu, use the following commands:

```sh
sudo apt update
sudo apt install postgresql postgresql-contrib
```

After installation, you can check the installed version using the following command:

```sh
psql --version
```

### Installing Apache HTTP Server

To install Apache HTTP Server on Ubuntu, use the following commands:

```sh
sudo apt update
sudo apt install apache2
```

After installation, you can check the installed version using the following command:

```sh
apache2 -v
```

### Running the Next.js App

First, install the project dependencies:

```sh
npm install
```

To run the development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To build the project for production:

```sh
npm run build
```

To start the production server:

```sh
npm start
```

### Configuring Apache HTTP Server

Create a new configuration file for your site in the `/etc/apache2/sites-available/` directory:

```sh
sudo nano /etc/apache2/sites-available/your-site.conf
```

Add the following content to the file:

```apache
<VirtualHost *:80>
  ServerName your-site.com

  ProxyRequests Off
  ProxyPreserveHost On

  ProxyPass / http://localhost:3000/
  ProxyPassReverse / http://localhost:3000/

  ErrorLog ${APACHE_LOG_DIR}/error.log
  CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

Enable the new configuration:

```sh
sudo a2ensite your-site
```

Reload Apache to apply the changes:

```sh
sudo systemctl reload apache2
```

### Configuring PostgreSQL

Open the PostgreSQL prompt:

```sh
sudo -u postgres psql
```

Create a new database:

```sql
CREATE DATABASE your_database;
```

Create a new user:

```sql
CREATE USER your_user WITH ENCRYPTED PASSWORD 'your_password';
```

Grant privileges to the user:

```sql
GRANT ALL PRIVILEGES ON DATABASE your_database TO your_user;
```

Exit the PostgreSQL prompt:

```sql
\q
```

### Execute SQL Script

After setting up the database and user, you can create the necessary tables and set constraints by executing the SQL script located in `prisma/schema.sql`.

First, navigate to the directory containing the `schema.sql` file:

```sh
cd prisma
```

Then, execute the SQL script using the `psql` command:

```sh
psql -U your_user -d your_database -f schema.sql
```

Replace `your_user` and `your_database` with your actual PostgreSQL username and database name.

This command will run the SQL commands in the `schema.sql` file, setting up your database schema as defined in the file.

### Update the .env file

Update the `DATABASE_URL` in the ``.env`` file with your database information:

```env
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/your_database?schema=public"
```

The ``.env`` must be located in the project home directory. If it does not exists, create a new empty file and add the above configuration or copy the ``prisma/example.env`` file to ``.env``.

## Migrate Data Using KNIME Workflow

If you have existing data in a JSON file that you want to migrate to the database, you can use the provided KNIME workflow (`workflows/migrate_data.knwf`).

Before executing the workflow, you need to update a couple of things:

1. **Update the JSON file path in the JSON Reader node.** Double-click on the JSON Reader node and update the file path to point to your JSON file.

2. **Update the database connection details in the PostgreSQL Connector node.** Double-click on the PostgreSQL Connector node and update the database host, port, database name, username, and password to match your PostgreSQL database setup.

After updating these details, you can execute the workflow (either from the KNIME GUI or using the command below). This will read data from your JSON file, transform it, and insert it into the database.

```sh
knime -nosplash -application org.knime.product.KNIME_BATCH_APPLICATION -workflowDir="workflows/migrate_data.knwf"
```

This command assumes that you have KNIME installed and available in your system's PATH. If not, you'll need to replace `knime` with the full path to your KNIME executable.
