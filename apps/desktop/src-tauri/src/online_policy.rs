//! ADR-0015: no durable offline mailbox.

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CachePolicy {
    /// Ephemeral session cache only (current thread / open message).
    EphemeralSession,
    /// Forbidden for Prism Mail desktop.
    DurableMailbox,
}

#[derive(Debug, Clone)]
pub struct OnlinePolicy {
    pub cache: CachePolicy,
}

impl Default for OnlinePolicy {
    fn default() -> Self {
        Self {
            cache: CachePolicy::EphemeralSession,
        }
    }
}

impl OnlinePolicy {
    pub fn allows_offline_mailbox(&self) -> bool {
        matches!(self.cache, CachePolicy::DurableMailbox)
    }

    pub fn validate(&self) -> Result<(), &'static str> {
        if self.allows_offline_mailbox() {
            return Err("durable offline mailbox is not allowed");
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_rejects_offline_mailbox() {
        let policy = OnlinePolicy::default();
        assert!(!policy.allows_offline_mailbox());
        assert!(policy.validate().is_ok());
    }
}
