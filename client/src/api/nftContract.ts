import { BigNumber } from 'bignumber.js';
import { MichelsonMap, WalletContract } from '@taquito/taquito';

import { retrieveStorageField, Address, Nat } from './contractUtil';

interface CreateTokenArgs {
  symbol: string;
  name: string;
  description: string;
  ipfsCid: string;
}

export interface NftContract {
  createToken(args: CreateTokenArgs): Promise<void>;
}

const mkNftContract = async (
  contract: WalletContract,
  ownerAddress: Address
): Promise<NftContract> => ({
  async createToken({
    symbol,
    name,
    description,
    ipfsCid
  }: CreateTokenArgs): Promise<void> {
    let tokenId: Nat;

    try {
      tokenId = await retrieveStorageField<Nat>(contract, 'next_token_id');
    } catch {
      tokenId = new BigNumber(0);
    }

    const params = [
      {
        metadata: {
          token_id: tokenId,
          symbol,
          name,
          decimals: new BigNumber(0),
          extras: createExtras(description, ipfsCid)
        },
        owner: ownerAddress
      }
    ];

    const operation = await contract.methods.mint(params).send();
    await operation.confirmation();
  }
});

const createExtras = (description: string, ipfsCid: string) => {
  const extras = new MichelsonMap<string, string>({
    prim: 'map',
    args: [{ prim: 'string' }, { prim: 'string' }]
  });

  extras.set('description', description);
  extras.set('ipfs_cid', ipfsCid);

  return extras;
};

export default mkNftContract;
