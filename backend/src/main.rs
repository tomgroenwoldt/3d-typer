#[macro_use]
extern crate rocket;
extern crate dotenv;

use dotenv::dotenv;
use rocket::tokio::sync::broadcast::channel;

mod message;
mod routes;

use message::Message;
use rocket_auth::{Error, Users};
use rocket_cors::{AllowedOrigins, CorsOptions};
use routes::{auth::*, message::*};

pub async fn create_authentication_pool() -> Result<Users, Error> {
    dotenv().ok();
    let postgres_url = dotenv::var("DATABASE_URL").unwrap();

    let users = Users::open_postgres(postgres_url.as_str()).await?;
    Ok(users)
}

#[launch]
async fn rocket() -> _ {
    let rocket = rocket::build();
    let figment = rocket.figment();
    let domain: String = figment.extract_inner("domain").expect("domain");
    let origin = [format!("https://{}", domain)];

    // CORS setup
    let cors = CorsOptions {
        allowed_origins: AllowedOrigins::some_exact(&origin),
        allow_credentials: true,
        ..Default::default()
    }
    .to_cors()
    .expect("Error setting up CORS");

    let users = create_authentication_pool().await;

    rocket
        .mount(
            "/",
            routes![post, events, login, logout, signup, authenticate],
        )
        .manage(users.unwrap())
        .manage(channel::<Message>(1024).0)
        .attach(cors)
}
