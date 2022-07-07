#[macro_use]
extern crate rocket;
extern crate dotenv;

use dotenv::dotenv;
use rocket::{
    fairing::{Fairing, Info, Kind},
    http::Header,
    tokio::sync::broadcast::channel,
    Request, Response,
};

mod message;
mod routes;

use message::Message;
use rocket_auth::{Error, Users};
use routes::{auth::*, message::*};

pub async fn create_authentication_pool() -> Result<Users, Error> {
    dotenv().ok();
    let postgres_url = dotenv::var("DATABASE_URL").unwrap();

    let users = Users::open_postgres(postgres_url.as_str()).await?;
    Ok(users)
}

#[launch]
async fn rocket() -> _ {
    pub struct Cors;

    #[rocket::async_trait]
    impl Fairing for Cors {
        fn info(&self) -> Info {
            Info {
                name: "CORS",
                kind: Kind::Response,
            }
        }

        async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
            response.set_header(Header::new(
                "Access-Control-Allow-Origin",
                "http://localhost:3000",
            ));
            response.set_header(Header::new(
                "Access-Control-Allow-Methods",
                "POST, GET, PATCH, OPTIONS",
            ));
            response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
            response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
        }
    }

    let users = create_authentication_pool().await;

    rocket::build()
        .mount(
            "/",
            routes![post, events, login, logout, signup, authenticate],
        )
        .manage(users.unwrap())
        .manage(channel::<Message>(1024).0)
        .attach(Cors)
}
