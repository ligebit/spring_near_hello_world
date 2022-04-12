use near_sdk::{near_bindgen};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

near_sdk::setup_alloc!();


#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct Contract {}

#[near_bindgen]
impl Contract {
    pub fn get_answer(self, name: String) -> String {
        format!("Hello {}!", name)
    }
}