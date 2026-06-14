from gl import make_client, read

ADDR = "0x216c90ae3FB104640563f1391B2BbF44b7B9258B"
client, account = make_client()

print("get_stats ->", read(client, account, ADDR, "get_stats"))
print("get_policies(0) ->", read(client, account, ADDR, "get_policies", [0]))
print("get_chronicle(0) ->", read(client, account, ADDR, "get_chronicle", [0]))
