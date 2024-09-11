#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("ArHuC1Duwj9Qvz5KUWJiXfYnMTfZsqhe99JQY9DbrTaZ");

#[program]
pub mod web3chain {
    use super::*;

  pub fn close(_ctx: Context<CloseWeb3chain>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.web3chain.count = ctx.accounts.web3chain.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.web3chain.count = ctx.accounts.web3chain.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeWeb3chain>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.web3chain.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeWeb3chain<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Web3chain::INIT_SPACE,
  payer = payer
  )]
  pub web3chain: Account<'info, Web3chain>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseWeb3chain<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub web3chain: Account<'info, Web3chain>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub web3chain: Account<'info, Web3chain>,
}

#[account]
#[derive(InitSpace)]
pub struct Web3chain {
  count: u8,
}
