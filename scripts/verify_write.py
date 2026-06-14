import time
from gl import make_client, read
from genlayer_py.types import TransactionStatus

ADDR = "0x216c90ae3FB104640563f1391B2BbF44b7B9258B"
client, account = make_client()

print("Publishing a policy...")
tx1 = client.write_contract(
    address=ADDR,
    function_name="publish_policy",
    args=[
        "Community Marketplace Listing Standards",
        "Listings must describe a real, legal physical product. No weapons, drugs, or counterfeit "
        "goods. No hate speech or harassment. No requests to contact off-platform to evade fees. "
        "Prices must be stated honestly and no misleading claims are allowed.",
    ],
)
print("publish tx:", tx1)
client.wait_for_transaction_receipt(transaction_hash=tx1, status=TransactionStatus.ACCEPTED, interval=6000, retries=120)
stats = read(client, account, ADDR, "get_stats")
print("stats after publish:", stats)
policies = read(client, account, ADDR, "get_policies", [0])
pid = policies[-1]["id"]
print("policy id:", pid)

print("Submitting content for moderation (AI write under consensus)...")
tx2 = client.write_contract(
    address=ADDR,
    function_name="submit_content",
    args=[
        pid,
        "Selling a gently used wooden bookshelf, solid oak, 120cm tall, minor scratch on one shelf. "
        "Pickup available in the city center. Honest condition photos included. Price is firm at 60 GEN.",
    ],
)
print("moderate tx:", tx2)
client.wait_for_transaction_receipt(transaction_hash=tx2, status=TransactionStatus.ACCEPTED, interval=8000, retries=120)
time.sleep(3)
print("stats after check:", read(client, account, ADDR, "get_stats"))
print("moderated policy ->", read(client, account, ADDR, "get_policy", [pid]))
print("chronicle ->", read(client, account, ADDR, "get_chronicle", [0]))
