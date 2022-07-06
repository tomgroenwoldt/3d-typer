use rocket::{form::Form, get, post, serde::json::Json};
use rocket_auth::{Auth, Error, Login, Signup};

#[post("/signup", data = "<form>")]
pub async fn signup(form: Form<Signup>, auth: Auth<'_>) -> Result<Json<&'static str>, Error> {
    auth.signup(&form).await?;
    auth.login(&form.into()).await?;
    Ok(Json("You signed up."))
}

#[post("/login", data = "<form>")]
pub async fn login(form: Form<Login>, auth: Auth<'_>) -> Result<Json<&'static str>, Error> {
    auth.login(&form).await?;
    Ok(Json("You're logged in."))
}

#[get("/logout")]
pub fn logout(auth: Auth<'_>) -> Result<Json<&'static str>, Error> {
    auth.logout()?;
    Ok(Json("You're logged out."))
}

#[get("/authenticate")]
pub async fn authenticate(auth: Auth<'_>) -> Json<bool> {
    if auth.is_auth() {
        return Json(true);
    }
    Json(false)
}
