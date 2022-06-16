#[macro_use]
extern crate rocket;
use rocket::tokio::sync::broadcast::channel;

mod message;
mod routes;

use message::Message;
use routes::{events, post};

#[launch]
fn rocket() -> _ {
    use rocket::fairing::{Fairing, Info, Kind};
    use rocket::http::Header;
    use rocket::{Request, Response};

    pub struct Cors;

    #[rocket::async_trait]
    impl Fairing for Cors {
        fn info(&self) -> Info {
            Info {
                name: "Add CORS headers to responses",
                kind: Kind::Response,
            }
        }

        async fn on_response<'r>(&self, _request: &'r Request<'_>, response: &mut Response<'r>) {
            response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
            response.set_header(Header::new(
                "Access-Control-Allow-Methods",
                "POST, GET, PATCH, OPTIONS",
            ));
            response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
            response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
        }
    }

    rocket::build()
        .manage(channel::<Message>(1024).0)
        .mount("/", routes![post, events])
        .attach(Cors)
}
