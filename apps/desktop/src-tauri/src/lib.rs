//! Prism Mail desktop core (online-only policy + Bridge stubs).

pub mod bridge;
pub mod online_policy;

pub use bridge::{BridgeDelta, BridgeStatus};
pub use online_policy::{CachePolicy, OnlinePolicy};
