//! Optional Proton Bridge connector (localhost IMAP/SMTP).

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum BridgeStatus {
    Disconnected,
    Connected,
    Error,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct BridgeDelta {
    pub id: String,
    pub kind: String,
    pub version: u64,
    pub tombstone: bool,
}

pub fn default_bridge_endpoint() -> &'static str {
    "127.0.0.1:1143"
}

pub fn is_loopback(host: &str) -> bool {
    host == "127.0.0.1" || host == "localhost" || host == "::1"
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn bridge_endpoint_is_loopback() {
        let endpoint = default_bridge_endpoint();
        let host = endpoint.split(':').next().unwrap();
        assert!(is_loopback(host));
    }
}
