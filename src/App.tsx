import {
  useAddress,
  useNetwork,
  useContract,
  ConnectWallet,
  Web3Button,
  useNFTBalance,
} from '@thirdweb-dev/react';

import {
  Proposal,
  SmartContract,
  TokenHolderBalance,
  ChainId,
} from '@thirdweb-dev/sdk';
import { BaseContract } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { AddressZero } from '@ethersproject/constants';

const shortenAddress = (address: string) => {
  return (
    address.substring(0, 6) + '...' + address.substring(address.length - 4)
  );
};

const editionDropAddress = '0x6550E9AB550cdc932C77E6Bb6D20BC8533348430';
const tokenAddress = '0xd8B0E181cb194EFDe43D838b6D3BaDf5Fd992915';
const voteContractAddress = '0xe054E06DbFaC2a98DdC717340832b1f2F6629973';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState<
    TokenHolderBalance[]
  >([]);
  const [memberAddresses, setMemberAddresses] = useState<string[]>([]);

  const address = useAddress();
  const network = useNetwork();
  const { contract: editionDropContract } = useContract(
    editionDropAddress,
    'edition-drop'
  );
  const { contract: tokenContract } = useContract(tokenAddress, 'token');
  const { contract: voteContract } = useContract(voteContractAddress, 'vote');

  const { data: nftBalance } = useNFTBalance(editionDropContract, address, '0');

  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0);
  }, [nftBalance]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllProposals = async () => {
      if (!voteContract) {
        return;
      }

      try {
        const proposals = await voteContract.getAll();
        setProposals(proposals);
      } catch (error) {
        console.log('falha ao buscar propostas', error);
      }
    };

    getAllProposals();
  }, [hasClaimedNFT, voteContract]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    if (!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      if (!voteContract) {
        return;
      }

      try {
        const hasVoted = await voteContract.hasVoted(
          proposals[0].proposalId.toString(),
          address
        );

        setHasVoted(hasVoted);
      } catch (error) {
        console.error('Falha ao verificar se carteira já votou', error);
      }
    };

    checkIfUserHasVoted();
  }, [hasClaimedNFT, proposals, address, voteContract]);

  useEffect(() => {
    const getAllAddresses = async () => {
      if (!editionDropContract) {
        return;
      }

      try {
        const memberAddresses =
          await editionDropContract.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log('🚀 Endereços de membros', memberAddresses);
      } catch (error) {
        console.error('falha ao pegar lista de membros', error);
      }
    };

    if (hasClaimedNFT) {
      getAllAddresses();
    }
  }, [hasClaimedNFT, editionDropContract?.history]);

  useEffect(() => {
    const getAllBalances = async () => {
      if (!tokenContract) {
        return;
      }

      try {
        const amounts = await tokenContract.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log('👜 Quantidades', amounts);
      } catch (error) {
        console.error('falha ao buscar o saldo dos membros', error);
      }
    };

    if (hasClaimedNFT) {
      getAllBalances();
    }
  }, [hasClaimedNFT, tokenContract?.history]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      const member = memberTokenAmounts.find(
        ({ holder }) => holder === address
      );

      return {
        address,
        tokenAmount: member?.balance.displayValue || '0',
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  async function handleMintNFT(contract: SmartContract<BaseContract>) {
    try {
      setIsLoading(true);
      await toast.promise(contract.erc1155.claim(0, 1), {
        pending: 'Mintando sua NFT',
        success: {
          render: () => (
            <p>
              🌊 Mintado com sucesso! Confira no{' '}
              <a
                href={`https://testnets.opensea.io/assets/goerli/${editionDropContract?.getAddress()}/0`}
              >
                OpenSea
              </a>
              !
            </p>
          ),
        },
        error: 'Erro ao tentar mintar o NFT',
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (address && network?.[0]?.data?.chain?.id !== ChainId.Goerli) {
    return (
      <div className="unsupported-network">
        <h2>Por favor, conecte-se à rede Goerli</h2>

        <p>
          Essa dapp só funciona com a rede Goerli, por favor troque de rede na
          sua carteira.
        </p>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="landing">
        <h1>Bem-vind@s à CoffeeDAO - a DAO dos amantes de café</h1>

        <div className="btn-hero">
          <ConnectWallet />
        </div>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>☕ Página dos membros da DAO</h1>
        <p>Parabéns por fazer parte desse clube de coffee lovers! ❤️</p>

        <div>
          <div>
            <h2>Lista de Membros</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Endereço</th>
                  <th>Quantidade de Tokens</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Propostas Ativas</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                setIsVoting(true);

                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + '-' + vote.type
                    ) as HTMLInputElement;

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                try {
                  const delegation = await tokenContract?.getDelegationOf(
                    address
                  );
                  if (delegation === AddressZero) {
                    await tokenContract?.delegateTo(address);
                  }
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        const proposal = await voteContract?.get(proposalId);
                        if (proposal?.state === 1) {
                          return voteContract?.vote(
                            proposalId.toString(),
                            _vote
                          );
                        }
                        return;
                      })
                    );
                    try {
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          const proposal = await voteContract?.get(proposalId);

                          if (proposal?.state === 4) {
                            return voteContract?.execute(proposalId.toString());
                          }
                        })
                      );
                      setHasVoted(true);
                      console.log('votado com sucesso');
                    } catch (err) {
                      console.error('falha ao executar votos', err);
                    }
                  } catch (err) {
                    console.error('falha ao votar', err);
                  }
                } catch (err) {
                  console.error('falha ao delegar tokens');
                } finally {
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId.toString()} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => {
                      const translations = {
                        Against: 'Contra',
                        For: 'A favor',
                        Abstain: 'Abstenção',
                      };
                      return (
                        <div key={type}>
                          <input
                            type="radio"
                            id={proposal.proposalId + '-' + type}
                            name={proposal.proposalId.toString()}
                            value={type}
                            defaultChecked={type === 2}
                          />
                          <label htmlFor={proposal.proposalId + '-' + type}>
                            {translations[label as keyof typeof translations]}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? 'Votando...'
                  : hasVoted
                  ? 'Você já votou'
                  : 'Submeter votos'}
              </button>
              {!hasVoted && (
                <small>
                  Isso irá submeter várias transações que você precisará
                  assinar.
                </small>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mint-nft">
      <h1>Mint seu NFT 🍪 ele mostra que você é membro desta DAO</h1>

      <div className="btn-hero">
        <Web3Button
          contractAddress={editionDropAddress}
          isDisabled={isLoading}
          action={handleMintNFT}
        >
          Mint seu NFT (GRÁTIS)
        </Web3Button>
      </div>
    </div>
  );
}
