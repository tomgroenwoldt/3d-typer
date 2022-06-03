#[macro_use]
extern crate rocket;
use rocket::tokio::sync::broadcast::channel;

mod message;
mod routes;

use message::Message;
use routes::{events, post};

#[launch]
fn rocket() -> _ {
    rocket::build()
        .manage(channel::<Message>(1024).0)
        .mount("/", routes![post, events])
}
