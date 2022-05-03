export type Chain = {
  "version": "0.1.0",
  "name": "chain",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "padding",
          "type": "u32"
        }
      ]
    },
    {
      "name": "transferOwnership",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setPadding",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "padding",
          "type": "u32"
        }
      ]
    },
    {
      "name": "submit",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "block",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seed",
          "type": "bytes"
        },
        {
          "name": "blockId",
          "type": "u32"
        },
        {
          "name": "root",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "timestamp",
          "type": "u32"
        }
      ]
    },
    {
      "name": "initializeFirstClassData",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fcd",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seed",
          "type": "bytes"
        },
        {
          "name": "key",
          "type": "string"
        },
        {
          "name": "value",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "timestamp",
          "type": "u32"
        }
      ]
    },
    {
      "name": "updateFirstClassData",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fcd",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "key",
          "type": "string"
        },
        {
          "name": "value",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "timestamp",
          "type": "u32"
        }
      ]
    },
    {
      "name": "initializeVerifyResult",
      "accounts": [
        {
          "name": "verifyResult",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "verifyProofForBlock",
      "accounts": [
        {
          "name": "block",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "verifyResult",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seed",
          "type": "bytes"
        },
        {
          "name": "proof",
          "type": {
            "vec": {
              "array": [
                "u8",
                32
              ]
            }
          }
        },
        {
          "name": "key",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "value",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "authority",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "block",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "blockId",
            "type": "u32"
          },
          {
            "name": "root",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "timestamp",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "status",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "padding",
            "type": "u32"
          },
          {
            "name": "lastId",
            "type": "u32"
          },
          {
            "name": "lastDataTimestamp",
            "type": "u32"
          },
          {
            "name": "nextBlockId",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "firstClassData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": "string"
          },
          {
            "name": "value",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "timestamp",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "verifyResult",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "result",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotInitializer"
    },
    {
      "code": 6001,
      "name": "NotReplicator"
    },
    {
      "code": 6002,
      "name": "CannotSubmitOlderData"
    },
    {
      "code": 6003,
      "name": "DoNotSpam"
    },
    {
      "code": 6004,
      "name": "OnlyOwnerViolation"
    },
    {
      "code": 6005,
      "name": "WrongFCDKeyForAccount"
    }
  ]
};

export const IDL: Chain = {
  "version": "0.1.0",
  "name": "chain",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "padding",
          "type": "u32"
        }
      ]
    },
    {
      "name": "transferOwnership",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setPadding",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "padding",
          "type": "u32"
        }
      ]
    },
    {
      "name": "submit",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "block",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seed",
          "type": "bytes"
        },
        {
          "name": "blockId",
          "type": "u32"
        },
        {
          "name": "root",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "timestamp",
          "type": "u32"
        }
      ]
    },
    {
      "name": "initializeFirstClassData",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fcd",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seed",
          "type": "bytes"
        },
        {
          "name": "key",
          "type": "string"
        },
        {
          "name": "value",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "timestamp",
          "type": "u32"
        }
      ]
    },
    {
      "name": "updateFirstClassData",
      "accounts": [
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fcd",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "status",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "key",
          "type": "string"
        },
        {
          "name": "value",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "timestamp",
          "type": "u32"
        }
      ]
    },
    {
      "name": "initializeVerifyResult",
      "accounts": [
        {
          "name": "verifyResult",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "verifyProofForBlock",
      "accounts": [
        {
          "name": "block",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "verifyResult",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seed",
          "type": "bytes"
        },
        {
          "name": "proof",
          "type": {
            "vec": {
              "array": [
                "u8",
                32
              ]
            }
          }
        },
        {
          "name": "key",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "value",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "authority",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "block",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "blockId",
            "type": "u32"
          },
          {
            "name": "root",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "timestamp",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "status",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "padding",
            "type": "u32"
          },
          {
            "name": "lastId",
            "type": "u32"
          },
          {
            "name": "lastDataTimestamp",
            "type": "u32"
          },
          {
            "name": "nextBlockId",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "firstClassData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "key",
            "type": "string"
          },
          {
            "name": "value",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "timestamp",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "verifyResult",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "result",
            "type": "bool"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotInitializer"
    },
    {
      "code": 6001,
      "name": "NotReplicator"
    },
    {
      "code": 6002,
      "name": "CannotSubmitOlderData"
    },
    {
      "code": 6003,
      "name": "DoNotSpam"
    },
    {
      "code": 6004,
      "name": "OnlyOwnerViolation"
    },
    {
      "code": 6005,
      "name": "WrongFCDKeyForAccount"
    }
  ]
};
