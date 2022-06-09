use rocket::{
    tokio::{select, sync::broadcast::{error::RecvError, Sender}},
    Shutdown,
    State,
    response::{status, stream::{Event, EventStream}}, serde::json::Json
};

use crate::Message;

/// Returns an infinite stream of server-sent events. Each event is a message
/// pulled from a broadcast queue sent by the `post` handler.
#[get("/events")]
pub async fn events(queue: &State<Sender<Message>>, mut end: Shutdown) -> EventStream![] {
    let mut rx = queue.subscribe();
    EventStream! {
        loop {
            let msg = select! {
                msg = rx.recv() => match msg {
                    Ok(msg) => msg,
                    Err(RecvError::Closed) => break,
                    Err(RecvError::Lagged(_)) => continue,
                },
                _ = &mut end => break,
            };

            yield Event::json(&msg);
        }
    }
}

/// Receive a message from a form submission and broadcast it to any receivers.
#[post("/message", data = "<message>")]
pub fn post(message: Json<Message>, queue: &State<Sender<Message>>) -> status::Accepted<&str>{
    // A send 'fails' if there are no active subscribers. That's okay.
    let _res = queue.send(message.into_inner());
    status::Accepted(Some("OK"))
}
