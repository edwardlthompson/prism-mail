fn main() {
    let policy = prism_mail_desktop::OnlinePolicy::default();
    if let Err(err) = policy.validate() {
        eprintln!("policy error: {err}");
        std::process::exit(1);
    }
    println!(
        "Prism Mail desktop stub — online-only; Bridge endpoint {}",
        prism_mail_desktop::bridge::default_bridge_endpoint()
    );
}
