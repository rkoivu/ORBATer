(function(){
  const SYMBOL_PACK = {"infantry": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAXCAYAAAD+4+QTAAAC20lEQVR4nLWV3UtTYRzHP2ebezsem1t6ZK5pOW3pzBLJHYiEoq66CCm66aabxLrpqv4VpZAKbwqKiOiyq6BN5mzLyCDDwXFEp/J1YztsnS5EUTfnUvvCc/M8v+f78nvOeR5BVVVD13X+F9xuN0Lb8TYjTx6H5DhQcsMw+D3/m3t372Ep/CnQEG4go2Xoud6DVbTuW2AhtcDM6xmawk0AWARBIHAhgL6qE3sUw9/vx9fn2xN5sVDk86vPAJwZOsPs21kATOsFtY21KLcVcss5Jh5OkF/J/5PAr2+/iI5Eae5tJjQYwmwxb6xZNhcKgkDgfIDsqSzx8TjNp5vxh/2V3etFPr38hNlqJjwcxmQ2ldSUzgBOtxNlWKGoF4mORskt5coKaF80og+i+BU/XVe6ygqUJNmOo+eO0nSyicTTBHKnTOvZVgAK+QLTL6ax1drW3JvKk1clAuBwOei/1U/qfYrIaARvjxc1phIaDFHnrdttO7BDu8rBe8qLyWJi5s0McpdctQBUkQQg/SHN3Ls5uq91I8kSakwlMhKh+2o34mFxfyJ6Rif5LMkh3yGUOwqCIADg6/PReKKR5LMkLr+LtvNtG2vlsGO71JjK5ONJgpeDtF9sLyGxilb6bvbh9DiJjERY/bFafZL8Sp7E0wSeYx7Cw+GKDmHtrBqON/Dx+UfEwyIdlzoQTFv3bEmSep8iPh4nNBjatQWbUeOoofdGL64jLiIjEVa+r5QmyS3liD+JI3fKKMNKVcTlIHfJeAIepl9MY6+zI1jWTAot7S1GxpRB7pSpcdTsWWA7MlqGn19/cn/oPsLY2JihadqBkW/HwMAAgmEY/01gHRX/+HQ6veFgampqixtN06p2VzFJMpk0UqkUTqeT5eVlstksNpuN+vp6FhcXAZAkCUVRkCRpx09x17tLFEVEUcTtdjM/P49hGIiiiN1uJxgMkk6nKwoAaw/+fkYikTB2q/kLR6k2YeTVmn4AAAAASUVORK5CYII=", "armour": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAfCAYAAAASsGZ+AAACd0lEQVR4nO2Wz0sUYRjHP7POzu66Gw4EYsh26FAiFRZEUPfIQ0ehDmERFB46JIEUJpGRpBUUiRRhSFtBP/6AYA8bohF4kGBNJFxd1MPA6u7qbro7O08HUYxkZ9bdoEPf03t45v18v8+87zOjiAjFFI/HRdM06urqlKKFRaTYQSKRiFiWRSKRACCbzVJfX08ulyOTydDS0mILV+0KFhcXAQgGg4gIiqIQi8Xw+XwEg0EMw5Da2tqiINskdkomk6LrelGIy26T+fl5CYfDkkwmN91sXdsBwGGSkZER8Xq9LC0tISL4/X50XWd2dpbm5mZbiG2SDRmGQTQaJRAIkEgkSKVSzM3NOXrWUZJ0Oi2GYeDxeNB1HUVRME2ThYUFGhsbK9OucuW4Xf8hAMqli+ckNj351wCX2zpQv375zNPrCQLVO55/f0hE+BguMD5lMTMzsz67mg64qNlVGciPuMXdFyatZ1T27lFI42BAOpVlCU/emiwYQv8NDb9PYTJmARV68d+nLVpv5Tja4KL32jpgq8pKYprCw1cmyWXhWadGtW/7lu8Y8m3Komcwz9WzKieaqorWlgzJ5YX7L01W14TB2xo+r/2BKQkyFi3QN2TSfl7l+KHi7kuGrK4J3c/zKAoMdWt4PaUdd1vI6HiBRyGTjgsqxw46d+8Ikv0pdA3kqfbCmx4Nzb3zy7otJDJW4PFrk64rbo40lH+VfoMsZ4TO/jy7axTe9Wq4y3C/LeTTaIGB9yZ32twc3l/ZL4AqAu0PcuwLuvjQp6GqlZvGG1JOnzopE9EJqqoqvzlAx817/8iPRCgUkuHhYclmswKwsrKyuU6lUo4c/gIgoAYYXv3AmwAAAABJRU5ErkJggg==", "recon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAfCAYAAAASsGZ+AAACcElEQVR4nO2VX0gUURTGfzOjC7KsZSILUQ4YPuyzvUg9hERUj74aRCBIEJQlSb6EIhHUCtZDWPQX6UEqMliKpBXZICiIlshclKZmt2nRZWO3XWF3xrk9BJLo7oz/8MUPBu7ce7jfOd93OUc6euSAmPwyiaJIbAa6e64gCSE25fL/ITsFDA8Pi0gkIubn5wVALpdbXGcyGVcZVjgFpNNpamtrCQaDNDU1ifr6egzDQNM0UVdXR2trqyOJo1yxWEzMzc2RyWRoaGgglUohyzLZbBZVVfF6vaiqWtbQrfckkUiIcDi8Yha6rrvOrqwnmqbR0tIixeNxMT4+TiAQIJ/Po+s6gUCAiYkJ4ff7aW5uxufzlZSsbCWKohAKhcTMzAzJZBJN01AUhWQyCUBjYyOGYZQlAEAIsa4vGo0Kp5itN36bZJtkXZA6z50W8R/Tm0Zw4uQZKsZejdLfkcJbtbGTMfxhgfefbaamDv/rXYf2K+xw6AxuYcza9A5ZHDsos9cvkcXF0FoN7o9afIrZXD1bSU21xK0RE1iD8e+iC8v29F827b0F/LskBi96qKleqsqqKnn2xqKjv8j0iyp2+iSEENx+ahH7Lgie95SU3HUlhaKga8Ak9Rv6hky+JWxOXS6yb4/MQFdpglVVMvjYQvspFtfZnOBmtwef1/nBuKpkNi3ov2Mu/ts2GCnhisA1yaUbBf7kl+69fGsTiix/BGsieTJmce+5veLZhWAR03QeeiU9MU3BtYcWI68t1N0gS8ulKZowMrZA2/Hy1q54+vGrzfVHJp1tFfS0Vzlm6oQlJIWi4MpdE0WWeNDnwVO5Ma3mL/y7SP5KH9L3AAAAAElFTkSuQmCC", "armd_recon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAfCAYAAAB+tjR7AAAEwElEQVR4nO2Xa2iTVxjHf++bN4mmTRN7UWtHsoyJsaKhLWOUqbghG6zSidcVJgiOOdRNRcQv061MnFXqPslQcYVN5xSZF6ajDNRakdUI2oviardq7Noabc2tac17OfsQnHO1VYOtE/zD++Xcnt953uec8zySuGgTpCDXuwqBv8LSYGMikYh44zU39T/eZft+jYu/G1SstJA9atBpA0pOadYTSNMM5q9NkDdaYvcX1pRBASSPKzMlz9ozRlHf2DKo5VgsJiZPehXDSGCSU4e8J0mIlFifiZR4PC4AbDab5Pf7haIohMNhcnJy8Hg82Gw2CSAejwubzSaFw2HhcDhSdtOFCxeELMv4fD4JknFtGAZOp/OfNfft2ycKCgoQQuB2uwFobm5GOX36NFeuXGHKlCkiFouRlZVFR0cHubm5VFZWMnHiRDFhwgSuX79OLBYTFouFOXPmpOydy5cvo6oq4XBYRKNRABoaGvB6vULTNFwuF6FQiGAwSCAQoLq6mvz8fHp6elDy8/NJS0sjPT0dTdNwOByUlZVJdXV1orCwkOzsbDRNA8Dj8WC321MGBfD5fMiyjGEYyLLMmDFjUFUVl8uFyWTC5/NJVqtVdHd343K5cLvdyLKMLMvPV8wO+dX1bzU1NYlz58491DuBQOCB9mPHjgm/3/9A27B6tra2VhQWFtLW1kZzczNjx46ls7MTAKfTSTAYxG63U1xcTEtLC6FQCCEEZrMZXddRho0UiEaj1NTUoOs6kUiE3t5eTCYTfX19ZGRk4PV68fv92O12CRDRaBSr1UprayvZ2dkghPhfffX19WKgvhcHbKj0Anao9AJ2qPRcwUqls2aklnzbs9jzw8FHporz55YIRCIVE/0kfb/R8kSw3RHBoRM6DVetdIXij6zBCifnsX+z1q8v3pc0axsx+H5VTXA3Aek2CeWDWY/34goh2H1Ip7HFYP8WK5PmPV7+PXKEQlG+0a89EhOs2prgWrugZJqJkmkmvJ5kVLbdNPjljMHPtTqaJti5wULeaBlpoOr2zzaDzVUqgXbB6kUKh08azHxdZu7M5OZy3oJbXT2PVd02Hhg4DI6e0li6MUHnbXCPk0gfCZf+ENhGQMUqM8sXKkiSRN9dgdJ41WDy+PvnTAhB5Xcq3xzQaW0XCAG9CY2Tu6zIT6Ho+69KZyhMLTDxaUWCvcd1AKYXyVSVW3jlpSTX2Ys6O3/SUN5b1cfW1RbmzlTQdcGKzSqHT2h0diUXy3TAktmmIQG9p0yHxJ5NVha8rXHjpmDZgqQ3472CL3epjM6U2P25BWXvJgu//iaQZZXjZwwWlSg40+FIjc5IK6z/yMzsN4cnkyydcd/OqfM6VUc0PvvQzHh30sNKsU+h2AdFZb0sma0wvcjE9CITX60cFr5+ivYIyneovDxOoqrc8sAflQF2HFRZt9hMXZNBx61nlzJWn9X5pCLB8oUKK9439ws9+fwlnRudggXvKGxbY2Ht1wkS6vAC34kIVm5JcK3doKrcgifv4Q+rvG2PxoalZgCynBIfz1dYv10dNtCjpzTWVCZYs0hh6TwzkjTwQZbXLTZjMd8fMLXAhD1Noj3Y/yJ/mrp9R7BsU4KuMHxbbsWV++g05W+iTG68rCd/KwAAAABJRU5ErkJggg==", "artillery": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAfCAYAAAASsGZ+AAAB6klEQVR4nO2WP2taURiHH82p5+IN1D+DVbmJSMElH6Dg1KGfocSldBKyhUDmroVOLhk6lU4ObejSoR0Kl2aQugW0CLmEohh7IXqjxlw1nE6GUBJvbGMH0992OOe8zznnd17e17dmGOprNMr9pSW89GM4xHJdHuk6mt/vuX7HtjnZ2EB4rryklUCAlUBgli0AeB/nFrQ4EIEQPOt0uHcDI2fVwekpTwFfpVJRg8Hg1gETJZNJfEqpuQEm8vzChUJB5XI5TNMkHo/TbDbJZrP0+31arRaZTAZN0wgGg77rYkw1olarKSklpmliGAaTZy2Xy1SrVaSUFIvFqQDPm0gpyefzvlKppFKpFPV6nVgshq7rOI5DIpHAtu1pIQD+3pNOp6NCodDUm/wT4xcn4/9D7ihENBoNNRwO5waIRCL41tJpFR2NEHOoJ/Vul+fb2whGIz7csFuZVTtKccIiGX8HIG/abR5bFk8OD3n1W2H61u/z8uiIn6PRn0PGSvHWcfiytcXnzU32xmP2ej0s18VyXaJC8K7dxtjfZ92yMLvdqZAry2/v/Jywpl2MHywvUzw+JnmpD9b8foZK8dFxiArBQylJXNMnXwkJCYFyXV7s7hKUkgPb5lM6fTH//eyM9+02r1dXWQ+H0T1y7Bf2z7J+SpVnrwAAAABJRU5ErkJggg==", "rockets": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAfCAYAAAB+tjR7AAAEx0lEQVR4nO2YXWwUVRTHfzM7nW232253t9iPbbfbLm1oCUakpk0wQSi+qNGY6AsmgrwYX0CfRJQn04iJ+mJMMA2JgiEhKYT6kZqAmCXGNDawZAOV9IPQLjt2y7Ifs+3Q7m57fbDWln6wbVkNif/kPszcc8785t5z75m50kcul9jjcOBWVbKR++ZNRqJRaSWbYDAoWp5pYdfRXQvuT01McfGTi7S+3MrtgdsYUwYte1rm+gcuDKD5Neqfrafi8QokeeFjlC5dJzA1xaeVlVTk5WUFvFaZC820HWpj6NchHJscbNm8ZUG/52kP9bvrl/VXLhw8SJ+msf/cObpra3MKC5C8naRxZ+OSfXn5CwcrGU6iFqqYrWYA5ML8fJ6qq0NWlJxCjo+N03Osh8nEZNY+pjwT/pN+gr8FAVCi4+P8rmmQyeQEcmZmhv4f+zHuGmx7fRt5luxTzeKw0PpWK0M/D9HzZQ/Km8ePs0FROFVd/dBBY8Mx+r7tY2PbRjY9t2nNcbw7vZRvKUdpnt0FjkUiWTlOpdNZ2SWjSS5/dZmyzWVE+iNE+rOLv5IU6cCBVTkcNpsfaFNSUsKR946slWlZSUKIhx40V5INwxC6rgsAwzCEpmmis7NTXL9+XQQCATEwMLDut/H7/QJA0zQRj8fFlStXhK7rIhAICIAzZ86Is2fPzj0nGo2Kvr4+EY/HxXw+xefzkU6nKS0tFaqqUl1djd/vp7S0FCEEVqt1vawYhgHAtWvXiMViTE9PMzIygs1mA2BsbAyAS5cuiWQyiSzLJJNJuru7aWpqmuOTa2pq8Hq9mM1mCgoKGB4epr29XUomk1itViRpxcqalYqKivD5fKKsrIxMJoPT6aShoWFuINxuN7W1tTgcDmw2G42NjciyjNfrZT4fQogFbWxsTKx0vd7m8/nWHC/nC2x0dFQEg0FcLhfhcJitW7cuO1WBQEDIskwikWD79u2L7HJbYwFN0wiHwzgcDoLBIJFIRIyOjuJ2u7l69So2m419+/ZJAL29vTidTioqKjh//vwiu5yPbG9vr0ilUqiqyvT09F/TKUkYhsHExASSJNHc3Ex5ebnU1dUlJicnkWWZqqqqRXYPLReXa4ODgw/M0VgsllUeP1pF4b8GWI3+h82VHilYpaOjY1UrTFVV9u7d+8AavNq42Ug6Wle3qqCf3blDWNdXhNV1XTRUVvJOWdn66O6T8q7dviqHL2KxrOw2FBSwVOyRVIq3g0Ea8/N5qaSEZosFed7HUt+9e3yXSPDL+DgfVlbyhMUCQCyTyX25vV9uVeWkx8OhUIjWGzd4TFF4wWaj0GTi+3icm6kUL9psdNTUUD57jtEVj9MZi6Fc0PVFAZstFkpy+GteaDLxudvNK3Y7+2/d4vjduwDYTSa+8Xh4zekE4E46zQeaxpMWCyc8HpT3QyGcikKh/M/GUOVy5RT2b+0oKiLQ1MShUIhgKsWxeaN5Ohrlh0SCdpeL6tmfWkUCikwmTtfV5RxuKVlkmbbiYu7NzGA3mfgjneZwKMQOq5UT950QKbuLi3GpKqeiUfY4HP867BvDw3w9mwYbVZVWq5WPXS4qlzgolK0mE8/bbPyk60RzdCqznAYmJ+dAAQZTKV6125cEBfgT8NfgnFn3D7sAAAAASUVORK5CYII=", "mortar": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAfCAYAAAB+tjR7AAAEZUlEQVR4nO2YXWhTZxjHf+ej8TRJc+ppQ6ixDW2qTRW/bgzYG8Vd7QMHY1djF8IsyO6G1wO328FuxhheOHS73NV2I9W2GxSmYDqMdtDGmpA0FvJlcs7pMVmavrtauuqsiTaKsB+8F+/7Ps///fPynA8eaW5sTPSpKhFNoxWGHjwgXSpJ28WYpikmwmHuhkItacYdh8dCcNztRpKeLa1OeL0tCbaLUBQm8/mn1vcqCp8bxpa1w273f2p8Uy4Tr9ebc3VnLW7i83q5dPbsU+vnr15tWWNBCC5NTjbnHTP7LLK1GpOPH7cU+2ettmX+ys3+fO7cC+eqHz561FaCs77eUlwin+fTqakX8fRMpFgsJtpJUBSFI0eObPs2AJifn29LtxUkIXZcs2Ooi4uL4uHDh0QiEWzbJplMcuLECbxe73Nvr10SiYTI5XLous7GxgZ+vx/btikWi1QqFUKhEJqmUavV0HUd27axbZujR49KAGq5XKZarRKPxymVSjQajY4YBcjlckxMTEjXrl0ThmGwsrJCKpWiWq0SDofJZDLU63XC4TDpdJq1tTV2797dzJfu3LkjZFnG4/FgWRaSJBEMBjEMoyOGp6enxfDwMIVCAV3XqVQq2LZNMBjENE08Hg+BQADbtrEsi0AggN/vl+ANq1l5bm5OLCwsCMdxmqMTB12+fFlks9nmGfPz86JcLjfPMk1TVCoVAWBZlpiammrG/ROjrq6usry8zPXr1xkbG0PTNNxut4hGoztaBtVqlUQigW3bKIqCLMskk0kKhYLQNA2v14tpmpw6dUrcv3+fVCpFo9FAlmVmZ2eFYRhI09PTQpZlFEWhr68PIQQul4t9+/btqNl79+4Jn8/H0tISe/bswXEcuru7KZfLqKqK4zhomobf78dxHHp6esjn88iyTDab5cyZMxJCiC1jaWlJPLn2usfi4qIQQrxhD9jrNtAO/5vtFGoymWyraGVZJhQKPfdN0a5uK0inQ6G2RP8olSia5rZmM5mMGN0/ysDoAC7N9XIO/4V6o7+/rYQh02wpzhgw8IQ9uDwuxt8bR1ZevuLkX8plii3+/beDJEkc++gYgQMBbn57k1Kq9MJadadO7EoM+etcjivF4g7a3Er//n6i56NkY1nu/nSXRr3RVv5qfJXYDzEi70SQZy2L7/J5OvlxUFSFQx8cYvD4IImpRMt5pQcl1nJrRCejePo9qDKQqNWYsSxO+3wdMwzQO9RL71Bvy/HGiIExstkQUT8LBDjU3c1vtt1xswC3fryFvWojhGD83XGCB4LNveVfl1FUhcHoIEqX8lSu2qeqnOzp4eMnWjqdIBPP4NN9XPjiAvW/6lz85CK+vs0L0vfqzHw5w+3vbzNycoTRt0bxDWzuN5sc2zXEdgqrYDE4PAhAl6sLCYn07+nmvtgQdHm6cAoO6ZtpdvXsIvJ2BMWlbDX7KghHw8x8NcP6xjoriRX0EZ2D7x9s7iduJDCGDaKTUQYODyDJWy/wbz/xTrUfohRBAAAAAElFTkSuQmCC", "air_defense": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAfCAYAAAASsGZ+AAACRUlEQVR4nO2WPUgbYRiAn8vPaa5nT+4wht5FTUukhQttly4drFBwKHSyoEOdi2Pp0MHBrUudBUsX6dJCl0KhSulUsAXXGHDQDtYQDHfJEXPxNH4dWgqNiRENDsVn/T7e5/3e9/uT7GRSfDUMtHCYTjO/s4M3PU2o45GbEGk1sB0ELHse33d3qQlBCAhLEgDiz5zg8BBLlrmrqoz29BALNc/5iOSz5/HGcUhEIjzQNB4bxt/gzfDqdT6Wyzzb2uJSKMSTvj6udnU1l/wMAmbzee4oCvMDAy2zauRyOMykrjOp62wHAXOFAv3RKE/7+/+VfPE8PpTLvLQsjEjLCrbliiwzl0zyrVJhanOTW4ryWyKE4FWxyENN473rnlrQyG1F4a3j8AiQXi8siJ18vmPBG7k3NoYkhGg7sVKpCFVVW3e/DU0bsLi4KDKZDKqqEo/HWVpaAhAjIyO4rks2m2VoaAhN0xBCUKvVSCQSFAoFbNs+kkxTSRAErKyskMlkSKfTkmma4uDggNXVVWKxGLqus7a2RiwWwzRNSqUSuVwOWZaxbbv9SlzXFRMTE2SzWSzLAqBer6PrOoODg1SrVXp7e5EkiWQySXd3N9FolHQ6TbFYbFquE/XkrJzL3XUhuZBcSNojDd8YFk7JQTrmiT0tftVn5vkMkaAeMPpiFFmROy5ZX14HjvmtNLLv75N7l8Mv+sRvxkndT51YduKebHzaYHxqHNMyMUIGzg+n85K90h7mNROA1PUUvuN3XnKWjfH/nJNzkfwCF2m/M2finhUAAAAASUVORK5CYII=", "aviation": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAbCAYAAAAZMl2nAAADWUlEQVR4nO2XXWhbZRjHf8k5PUtCSGkq6Ud6SintiesKLSUdVJYMvFIHeiFI8QPxQplMHAreCIp6NVCoDjdkaEHEgVCdm6swKJQUykKrLaWFbukHUdKW0iQNXRJ6Ts7x9aIzuEHiGhPYxf7w3pz/c97n98L/5TzHls1mxfGhIQyjQC0kSXZ+uHyZvr4+W6maXC4nZMuy2N7Z4fUvLtYE5Lv33yObzZatsSwLGUCW6zg69ERNQI44nA9UZ69J9wr0COR+yeXMxO1b3PjmEsKyeOb0GVq7tXv8vVSSa+dHyGYynBx+6X/lrCTIfi7HueHnuZNKAXDz6hWeO/sup958C0mWufnzT3z/0QfcSR/4M9ev8fH1G6hHe6oLkrh9qwgBYBoGP356jrW532nt1vj1qwv31FuFArHfZqoP0trVzRGXCz2fLz4LvTDMix9+guJ04nS7uXp+BNMwir76eGUQZUFcHg9nv/6WX778HLlO4ak3TtMbOln0n337HYJPn+LKyGektzZ58uVX0QaPVx8E4NiJEMdOhEr6rd0aZy5eqrj5v/XQXN9HIPdLBvjLstj584+aNDBN88FAJEniMW8DF157pSYgjjoZt9tdtkaSJGxCiJoAHFYVZSSfz1edXt7c3BTRaJRQKEQ8HqetrY1kMsn29jZerxev18vu7i5+vx+fz2eLRqNCkiQaGxtFPp/H5XJhWRZ7e3uoqsry8jLNzc00NTWhKAqrq6sYhkEwGCw5KgLIS0tLpNNpZmZm0HUdgI2NDRoaGlhZWaGjowNd11lbW8Pn86HrOu3t7UxOThZBDcNga2uLeDyO3+8nk8ng9XqJxWIAxX3LggQCAYLBIOvr67S0tJDNZrHb7SiKgsfjweVy4Xa7SSQSAPT29jI/P084HCaZTKKq6sFGsoyqqjgcDlJ3P5aaphGLxejs7PxPkIc/rKOjo2Jubq5I+U9AZ2dnRTKZFAsLCyISiYiJiQkBB78EmUym4lOVHoz290mn00xPTwvTNJmamkLTNOF0OhkcHLSNjY0JTdNIpVKMj48LXdcpFAr09/eLQCBQNpiHAgmHw9jtdgzDwLIsBgYGqK+vJ393Punq6kJRFHp6epAkCdM0WVxcRJKkwzIcSAhRtRWJRESl7/4NtVS0oaM+xY4AAAAASUVORK5CYII=", "attack_helo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAbCAYAAAAOEM1uAAADgklEQVR4nO2WXWibZRTHf+mbRJtkKf3yIulSEtrIqrYvwU7bYgdSxC8KWhziJwrKcFQUb7wRN9CrySqFzflxIYJFoa5zrIiXbVeVpfSmjDqKxYwmjncmjUvefL1583jhGqbLZ/dGb/zDc/Occ3h+53nOeTimZDIp7hsaIpvTaIQkqYmvZ2YYGBgwlfNRVbUsg1nXda4oCq9Mf9QQwNn3j5BMJiv66LrOr6EQk59+fjMggMVqZd/QcNXD4orChy+/wB3d3chjDzH8xETVmGa7o6oPgFmSSjKYa4q+LlHQMVstDD/5FD5Zrid012qqNyCf00hd+4NCXm8Ez02q6wYB2ru6anpao1QR8MrmL8yfOoHQdR49dBhXr5/JU58V7deiv3N2eopkPM6Bp5+tqY4NA8yoKu9NjJOIRgH44cxpxiff4PHXJjFbrfx45jRfHnmHROwv+4VzZzl67nv27uszDC6jquUBty79XIQD0DWNuePHuHThJ7rvuofvPj75N39d07h4ftFQwKuXQ+UBXT293GazkU2linsjEwd55t2j3G53YNuzh2+np8jnckW7Tw4YBgfQ7u4qD2hzOnnrixnmjh/DbLHy8KuHuPuBA0X7+Otvcu8jjzE39QGx3yI8+NyL+Af3GwpoczorN8md++/n7a++KWt39fo5fPITQ6H+qbr/wX9b/wPeqswABb3A1cuhhhyg3dDllVQolGYwS5JER3sbJ1563mg2ACwWMw5H5YlGkiT2ejwlGUxCiIaAGaWaajAej/9nWVSdZoLBoCgUCtjtdiGEYHNzE4/Hg6Io+Hw+Wltb2draQpblsiN9QwEBEokEQgiEEIRCITo6Omhra2NlZQW3243T6WwEG1BDDUYiEeFyuUzhcFisr68Ti8UYGRlBVVXS6TROpxOHw0FnZ2dDbrCuJgmHw8LtdjcEpJxKAm5sbIilpSVkWSYQCJgAUqmUsNlspmAwKLxeL+FwmHg8jqZpjI2NmVRVFZqmsb29jdfrveUkdhhK1mA6nSaTyRCLxVheXhb5fJ7FxUX8fr9obm5mcHDQNDs7K/x+P9FolPn5eZHNZtE0jf7+flZXV8VOYrvVDkNJQE3TGB0dpampiVwuh67rBAIBWlpaSF2fD3t6erBarfT19SFJEvl8nrW1NbLZrCFNs8NQ7M4bl6IootR+tbWwsCAikciuYssx/AkPSuHS9PgqbAAAAABJRU5ErkJggg==", "fixed_wing": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAbCAYAAADlJ3ZtAAAE/klEQVR4nMWWe2xTVRzHP+1uO7rhKqwljK5jm6NjCHNrXDQMNoTFyBgSnkrUIEYiU3EqggQCCEEwPAQBISCK4eUMIBhB0qgIW+ZANjI7gdCS8AibstKtta91pff4FwtjAUZX4Pvn7/X9nHPPvfcoMjIHCiJQjBTD11u2kJ+fr7hb3YhRo0RYjsiik6RJS5dH1Lh32RLcbvc966z19ZRt3xWRx+2SDn25nnitFn1KfybOmcey8SW8uuRT0nNy79rYIz6+SwZqtZq07KeiwYrS0+xk6ITJ5E+czJnK4/TuZ+Dozm+jMjyaCgb8SEKW8f/nJhQMcuy73ah79KDu6K/43G7itdpHzQjAueo/+G3HdiRVbCxDx0/E0+zE52ph6up1JJsGUn3wB4qmTX+kkAGvlwNrVpKg11O6YTPKN1atBeCx3onMK9+PLtnIiFdeo+nyJTbPKsV67OgDAWm8YGfb7DL2LF2Ms+Fqp/zpXywsnzSOxgt29Cn9iZEkpEWji3hx1vuUvD0LSa2m1nKEHQvm4Wq6BsDJn35k4YFDPJFrjhqo69o1lo4rJuDxAHBsz04mf7yAUdOmE/B42PZRGfaaU3icTuAM9cd/B0AKh0Ic+HwV5/88QdbQYexfuaLDYCHLnKuuiirspXprOyhA0O9n1+IFVO4tRwjBlTN/d+o5bTmCEiB/4hTe2bSVktJ3mbrwE9Q9NB0K04ZE59NzU3369+8USzQkkzdmLIsOHmZc2YfEqFQd8skDs5Dm7P6ewcML24MvzJiJ+fnR7F/9GY4rlxk+5WWeHF4QVdh+A0zMWLuenzdtJNjaSmJSP976YiOJhmQAJsyeS96YsZQvW0LTpYsMLnyO0TNmIt0KeuvKSzdsjirg7RpS8BznT1ST+cyzDJv0Uqe8cWAWc3aVd4hJD5ToDqrav5dz1VVMmjufx/v06XKf8gEydVLLv/+wbXYZklrNm6vX3RcoPKSdFUJQUb6Hi9a/mDJ/IQmJuojmSI4rlyNqvBFq61KdkGW++uA9ni4ew+srVkbkdVOKtAGmiC6bKpWKb7be+z6bkpomwrKMUtn9E6cQIjoX44ehTst1u90Pld7r9XbZT7LZbOLq1auMHDlSYbFYRFJSErIsC6/Xi8fjwWQyYbfb0ev19OzZk759+6LVau/66O9HFouFcDgscnNz0ev12Gw2UlJS8Hq9NDY2UlBQ0O4laTQaTp48iU6nE4FAAFmWqa2tJTU1lfj4eJqamoiNjeXs2bNoNBoyMzOjBgoQCARQKpXU1NSQlJSEVqvFZrMRDoeRZRmbzSZMJpMCQPL5fBQXF5Odna3o1auXMBqNimAwKOrq6igpKQHA4/GgUCgwGo3R5ASgsLCQYDCIz+dDp9Nht9sxGo0EAgG0Wi1xcXHttXd8wRoaGoTBYIjqLnZXkt/vF3FxcYpTp06JtLQ0GhoacLlchEIhDAYDPp9PhMNhrl+/Tnp6erfh7Xa7qKysJCcnB7PZrAC4G0NRUZHiJoO0Zs0aTCaT0Gg05OXlKfbt2ydMJhNOp5PDhw8LtVpNW1sbSqUSl8slbhpEqkAgQGtrK83NzVRVVYkbN25QUVHRJQbJbDaj1Wrx+/0AZGRkoFarGTRoEDExMQA4HA5aWlpISEjo7sYSCoUoKChAqVTS1tZGOBymqwxd+ilYrVahUqnIysrq9jFwOBxCr9ff9xyr1Sr+B32UHH0rC+2uAAAAAElFTkSuQmCC", "uav": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAbCAYAAAAOEM1uAAAEqElEQVR4nMWXbWxTVRjHf/e2K2wZTMBb2Dq7sZTBxpCmvM0QF0EiGpCoicSQQTRK/KIxvhFMFhV8AcG3AGoiAQnIm8AHSLZl8X0DI475gThw6wqusyvk0rWlvV3b29vjhwXEDMsKRf/JTW7Ofe4v/+c55znnXskxdZoAkGSJL7ZvZ/78+RIZ5HS5hCEyRdy8JAk+27r1Hx7MD69t4McDe7nocRMOh28IcbvdrGv+9rYYPPrBe8M8mH/Yu5tHX17D0c0bRwSRZBlrWVnGmFg4jLvjFDMX3p+VwYIxY4aNyc9/vpOy6TVZgTLpciDAjjUvUeKYkhOebDKbcwK6oiObN1K//h0Uux0AI5UibRgAdLQ0o/b1ZWcwl+Zi4TD5hYWMmzgJgGgoyKYVyzFSKRo/3Yavu4s7S0uzYua0fL6ebu6qqgbgwvlzfLXhbWSTzL51rzP93jpmP7Qka2ZOK3iHMpGLf5zn959/4tiWj1n94RYm2EpZUL/qpsxBjiuo2O30dJxCTyR45v2PkE0mnnx3E2aLBQDPrx0IIXDMmj1iZk4rCLDijfUEfH8Si1wGwGyxkE6n+f7L3fzSeIzyu2dmxcttCwOlU6exfG0DRzZtIJVKIUsyejLB3KXLWFC/KmteTg0KIfhuzy4G/H6WPvcCE0pswNBW03pwH/vfepMHVz/LuEnF/4/BtkMH2d3wGgDf7NrB42sbcMyazY5XX8Tb+RsAvu4uXtmzf8TMnK7BVDJx9T6dTpPQNAYjEQxd/ztGT2bFzGkF71uxknTKIHjxAgvrVzHBNrQpr2/6mrZDB7hw7hwPPL06O4OqtxeA5DXZZ5JIp9FCoX99fs8jj129vzZu7pJl1x2/VnpyeHXNnzy1EoC8PDNFRUU3NOiYMoVtK5+4YdzNSJakYR4kIW7T12eOlPONGiAajYpoNJqTzEfUJCdPnhSyPJRLX18f5eXllJSUEI1GCYfDaJqG0+nE6/VSU1MjNTc343Q6MQxDSJJEd3c3tbW1SJJET08Puq4TiUSw2WxYLBZisRiapqEoCvF4HJvNhtvtZsaMGSMz2Ns71EjhcJjq6moGBwfxer1omsaoUaPQdZ2mpiZGjx5NTU0NiUSCRCKB3++nq6uLefPm4fF4kGWZsrIy2tvb6e/vR1EUzp49i91uR9d1Ojs7sVqtdHR0UFhYiN/vH9ka7O3tFUIIAoEAiqLQ399PcXExkUiE8ePHYxgGyWQSVVWpra2Vjh8/LvLz8xFCEI/HqaioQFVVrFYrxcXF0pkzZ4TJZAIgGAxit9sxDINQKHSV19LSwuLFi4eOp//iUlVVZBPv8XiEEOLWu9jtdou2tjacTicul0sCiMVioqCgQGpvbxeTJ0/G5/MRCoXQdZ1FixZJmqYJwzC4dOkSFRUVGX9zb/kkGRwcJB6PMzAwwIkTJ0QqlaK1tZXKykqRn5/PnDlzpMOHD4vKykoCgQCNjY3CYrGQTCaRZZlQKCSuJHZbDOq6Tl1dHbIsk0wmMQwDl8tFUVERsVgMAIfDgcViobq6mitrT1VVgsEgY8eOzci/5SlWVVUoipJxmq6n06dPi7y8PKqqqjK++xfJRXRHXGYtlAAAAABJRU5ErkJggg==", "engineer": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAfCAYAAACLSL/LAAACUUlEQVR4nO2Xv2saYRjHP3ecP9GGCt4FhBKHlGyGDC5CVl0cChmKky3t5JLBDBmzZHJ3yJLJJYQ0UxfJnxCsCMIVpEp0UVPaEH9G305tE/TEk0srId/tfe957/k87/vc+9wjiUsEc+iLDrnP8OENRN7B10+w4jW27w9gPAaXc/r4vr7/hBUPyPJfW2UeKIDXr6D9A97uw/772VAADvvs8X29fDFpK42/fZxrx/61JCGWkgv5fwMY6RnMrJYWzPC6ODg4EFdXV4/meGdnh2g0Khk9NwQ7OTlhd3cXl8tlOVQ+n6dQKBCNRg1tZl6w8XgcTdMMo1pU7XZbdLvdmTZLm2NLCzZ3rQRIJpOiWCxOzI/HY4bDIQ6HY+q6dDpNIpEwlRKmwHRdZ319ne3t7QfzpVKJ4+NjMpnMxJrDw0NarZYZN+bBACKRCKlU6kH0Z2dnIpfLTcwDZLPZhYrx0ubYM5hZWQK2ubnJ0dGRFa/6I1PJf35+jt0++Y8cDAalYDA4dc3FxYXhNWIZmN/vN12eVFVdqKQ97Rx7DBkepSRJhMNhZFm2vFu5ublhb29vps3T6ZLy+byoVCoPorm+vrY8OtO1stFosLGxwenpqQgEAvR6Pe7u7hBCiLW1NQaDAb1ej263iyzLOJ1Otra2TH+ZpnfM5/OhKAqqqlKtVul0OtRqNTweD+VymXq9TrlcRtd1/H4/tVrNrAtggR3TNI1+v08oFMJms9FsNonFYni9XoQQ3N7eMhqNUBSF1dVVyWazLXTMCyd/p9MRbrfb8n7gt34B9/PBu532SWYAAAAASUVORK5CYII=", "signals": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAXCAYAAACS5bYWAAADF0lEQVR4nNVWMUvrUBT+0hixqRJttbpYFWvRQR1a9Q8IAdFNUbSgDnXSP6B0KoqLHcRFioso6KIgIiKIm4OKq106BI1DBWkKsRSTnjc8DMT32hTbDH5wIffcc7/7nZPDvYeJRCJERLALiUSCsfJZWloqSwMTCARIFMWqCPuO3d1d5PP5kmKz2Sx1dXVhbm6uJFculwNEUSQigh3D6XRaciuKQj6fr6TfxcUFjY+Pk6OqqbQJt7e3mJ2dRU0xh2QySe/v75ZEHMehra0N7e3tlrX5UywsLGBtbe1fsWdnZ7Szs4POzk643W5LIk3TIMsyPj8/aXNzE36/v+qiu7u7maOjI7PYm5sb2t/fx/b2Nvb29nB+fm7alM/nwbIsamrMMa6vr8Pj8SASieDk5ISampoqFjw5OUnX19cmm+nUra0txGIxsCwLWZbBsiympqaM9UQigcHBQQwPDxu2aDSKXC6H1tZWzMzM4ODgACsrK5VqhaqqGB0dxeLi4v/FOhwO1NfXG3Ofz4fp6Wljfnp6imAwaLJFo1HjOxgMIh6PV0UsAHR0dGBsbMz4S6bbQNO0isiz2SxaWloq4igFk9iBgQHc3d0VdfZ6vabMf8fh4SHC4XD11H2DqQxWV1cxPz8PSZIwMjICXdehKIqxHovFAMBkW15ehq7r2NjYQG9vL4aGhqpyG7hcLvA8b7IxoijS5eWl6YDj42O6urpCoVAoi1gQBITDYYRCIRMPz/P08fFh+dz29/dDkiTrIH/Dc/s1fsVz+4VfJZbheZ4aGhpsIU+n0ygUCpY163a70dzcbMnH2Nl4Vxsly+D19bWsSFRVtS1iWZYN7qKZTSaTlEqlwHEcGIaBqqrw+/1QFAUcx4HjODgcDjw9PSEUCtnSbQFAPB6niYkJyLJcPLOSJOHt7Q11dXVwuVzwer14eHiAruvQNA3Pz89IpVJltZE/xePjI/X09OD+/h61tbXFM6soCgmCwKTTaXI6nQD+9g6KosDj8YCIoKoqMpkM+vr6bMnql4aXlxcSBKG42EwmQ42NjbZ1/8VQ6tw/Hc4lcoD10QEAAAAASUVORK5CYII=", "log": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAaCAYAAABPY4eKAAADVklEQVR4nOWVT0gjZxiHn5g4mn82YVJXMVmrG4WRsgpS8LJU6K1Q2LoUeuypsKU9bcFDr4X23BbaQ8vSU0/N9uQi7AoebJpUGzQqsrExxmwCzioxOjEzmczXQ3D7J1mTolsW+oNhZp75Zp735Zv5xiaE4Cxj1wbE92/l8XZx6fkhAa43Pmd2dtZ2xjouX9N+/r9yRzuDHqnw22N4xQ9Tg3UWy8LvT2DsCkwMPJudl5adP0zB7R/h8RF8ch++i8P9Lfj0ARyU4XYEfs40Z63SsvO7v8Kd1+FNBd65DpaAeBaqNbjigS9uwjUZHjxqZBeWP9HgZXf9+Kq/vg/5wKLebSIPX96EW9cb2Y3hC8qVXvglC69dhW9joBng6ACfE+6+C589hIVtWCs0sgvLP56Gj+7BT+v1869vgVmrz+s3UZDs8NXbIEQja5WW8oGXIPJevWO39Cdf/KA9dl7a/s6bPbBddmH588iLtcLdS0J3W+vev8tKDm6cJ3//wzvkc1lOLt/N2KswNTX1N2b76//8v86LNedbW1tie3ubiYkJisUilUqFwcFBMpkMwWCQarWKqqpMTk7aIpGICAaDhMNhDMMglUrR29uLJEkYhoEsy8zNzTEzM4PH47G1lAcCAQqFAktLS3R1dSHLMvF4HF3XsSwLWZbZ3NwkEAiIcDjM7u4uNpuNo6MjJEkiFosxMjKC3W4nn8/T2dnZVAxN5vzk5EREo1EURSGXyxEKhSiVSvT09FCtVjFNk1wux/T0tC2ZTIparUa1WkWSJJaXl5FlmdHRUUzTxOfzUS6X0XWd8fHxhgIu/YXTNE243e6mnf4zHdFoVMRisacVbGxsCFVVRSKRaKhqf39fqKratNpsNivS6XSD+Gx8s3sdiUQCAJfLJY6Pj9nZ2WFoaIi9vT0syxKFQoFKpYLf76dYLNLf308ymRRer5fV1VUUReHw8JC+vj4Mw2B4eJiFhQXh8XhIpVL4fD5KpZJwu90EAgHW1tYEgN1up8PhcNDd3c3BwQGZTAav14umaYRCIVZWVtB1nWAwiGEYuFwuNE3DMAzK5TKKorC+vk6pVALAsiwWFxeFruvouo5pmpyenuJ0OqlUKk/vdTqdpNNpEEI8t21+fl5omiaedf0PUCHw+dbbrdEAAAAASUVORK5CYII=", "medical": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAfCAYAAAB+tjR7AAAC2UlEQVR4nO2WsUsbURzHvy8ch+hxCSoo0agloGCcFKRDB500mxk7dXB1c3PrP9A90CFDKLRQKoiLbRaTDgqakBqOKyldTKghkYv17pIj8dfB9mr1kpw9z2LJFx48fu/3+92H3733ew9EBKtRrVYpFApRq/XrIxaLUSKRsO2/vLxMqVSqrf91Bg8cSJZlUhSFrtvL5TLl8/kbdqdyBDs/P4/Dw8Mb9u3tbaysrDhJbSlHsPctzknwxcUFDg4OUKvVKJfLoVQqmXPDMO6K0VRbWF3Xsbq62nLv6bqOjY0NeDweNJtNMMbMOc/zbWNPTk5sATYajd95nHQDURTNDnC1G8RisY6x994N7lsPCtbRAZNlGYIg3LBHIhGEw2EnqS3lCHZ4eJhZ2UVRZKIoOkltqf9nGxiGAUmSbF2b5+fnqFQqtv01TbPj9gdDS1iO4zA2Noa1tTVbSW8rjuPg8/k6+lxlYER3/t5wTQ9qz1rCxuNxSiaTZskVRSFN0wgAjo6OSJZlOjs7M22/nompVIq2trZIVVXSNM1c1zSNFEWhbDZLxWLRtKuqStVq1favtdyzp6enGB0dRTQaJa/Xi0KhgOnpaYTDYUiShFqtBlEUkc1msbCwQPv7+1hfXwdjDJOTk9jc3ITX60U6nUYoFKJAIIDd3V3Mzc0hk8mgv78fjDHieR7Hx8dYXFykiYkJyzbYEXZpaQmVSgUzMzOo1+vo6enB+Pg4AGBqagq6rmNwcBAcx6G3txfBYBAAwPM88vk8+vr6MDAwgNnZWQwNDUEQBASDQQiCgJGRERAR/H4/AEAQBDQaDVuVdeWAFYtF8vv9HSt1W3W7gVvqwrqlLqxb6sK6JQ7qR8LnJ/8MgHxPwR69snWBmJUtlIC9T0CzCdSNy/m3cvtg6SvwXf35UbrMUSj9Pbht2JfvgMfPgIwMJNOX89c77YOfR4HcF+BFHPiwB7xNAG/euwf7Ax/0Jd867ZDeAAAAAElFTkSuQmCC", "mp": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAXCAYAAACS5bYWAAADCklEQVR4nO2WP0gjQRTGv43B4FoodiISkkUxbG+RQgMpglilUdHCQhAsbAyiqbQQFAXLVLZWghAMBFKJRPAfChJUQlTM4rqyuJAx6mYleVeZO0k08cyCB/fBNDNv3vxm5s17wxERxsfHiYhglmZnZyEIAveZTTUMVsYYRaNRLC0t1RTwTaFQCIqiQBCED20YYxSJRODxeNDf3/+hnRUAmpqaMDIy8unO/1ZbW1tVXVlLSwu8Xi8URUEgECjLYqkt2vc0NjbG8TyPUChUdoM/ChYAJiYmuJeXF6ytrZUA/zhYAAgEApyqqlhfX38HXBG2s7OT/H4/AcDi4iLZ7Xba39+n0dFRstvt5HQ6ye/308PDQ03TSTAY5FKpFDY2Nop+K8Km02ns7u5C0zQKh8PIZDLI5XJQVRXT09PY3t7G2dkZIpFILVkBAHNzc9zBwUHxkVqrmdTd3Y1oNApZluF0Oov9Ozs7UFUViqKgo6Oj5rAAsLKywk1NTZHNZqOqYranpwcLCwtwu93guN9ZJZ/Pg+d5bG5uwu12m5L6AGB1dZULh8PVPbDe3l5cXFzA4/G86+/r68PMzAzn9XpNA33T8vJy5TAIBoMQRRHz8/Pw+XwoFApoa2vD0NAQurq6zGYsqrGxkUMmkyFRFImIYEYbHBykeDz+qf9qGX5knv1I/2HNkhUAkskkHA6HKR9aVVUxOTlZ0a4aBs7MT3et9U+FQQlsPB4nWZbp9PSUrq6uKJVKlT36k5MTisVixbHz8/NvXxFjjGKxGN3c3JT1VVIUDg8PUVdXB0mS0NraCkmSwBij29tb6LoOh8MBm82G+/t7aJqGvb09ymazeHp6gizLVF9fj7u7OwwMDHy5qmWzWTw/PyOdTiORSJDVaoUkSXC5XNA0rfRkRVGEJEkwDAOFQgENDQ1IJpNgjKG9vR3X19cQBAHNzc0YHh7m8vk8crkcDMOAYRh4fHyErutf5QQAvL6+gud5yLIMi8UCXdfhcrmQSCTAGMOXK9LR0ZFp1e7Pdnx8TJeXl+/W+gXfElHcXn28SAAAAABJRU5ErkJggg==", "intel": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAXCAYAAACWEGYrAAACVElEQVR4nO2WsWoqQRSG/zGCiGFBGy0MoqKCiJ2Csob4AmJloUlnYyOWvoH2PkBi4QvY2UhSCFamkwTEQoKIsuqK6LquTirN5WaT60b3XoT7dcOc88/PmZkzQ9LpNIUMhBBks1n4fD4iN78jn89TjuO+CzmKu7s7aG9ubmQn7+/v0ev14PP5vhWpVCooFosq2AOq1Sra7Ta0qVRKtlJPT0+yFZbjK41j6Xa7FAA0aoifmv8mT4WGZVnabDYPPn9KKZVK1Gaz0Xq9TieTCXU6nfT29pY2Gg0ajUYPWlfbarXg9XrV8ojZbAae51Gr1bBcLsFxHIbDIURRRL/fP0hDGwgEwDCMKrdzB8uyeHx8hCRJiEQiWK1WivI1LMuqZO0Dj8eDt7c3VKtVXF9fK87X/CRJKYQQhEIhLBYLOJ1OxfnaYDCogq0PwuEwBEGATqdDLBaD2+1GMpnE1dUVMpnMYSaNRqOq5zEajX7S3z21uVzuII3z6JP/2sAhnIVJrd1ul+36HMchHo//UYAQgq80jmU6naJQKIBQqtqLeDLOYrv3Jl9eXk5W0t1ndTQa7TWfn5/pr2MlkHK5TC0WCyaTCSwWCyil6HQ6YBgGiUTiRz304eGBXl5eQq/XQ5IkmM1m9Pt9EELA8zxcLhdWqxXG4zEuLi5gNpsxGo1gt9vh9/s/rakZDAZgGAYOhwOdTgc8z8NkMkEQhJ/4AwBIkgSr1QqDwQCe57HZbAAAoihCFEXM53Os12tYrVYIgoDtdovZbLaP+52/enGGwyF9fX1FJBJRtEPvdU7tJzC4N4cAAAAASUVORK5CYII=", "ew": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAWCAYAAABZuWWzAAADL0lEQVR4nO2WS0hyaxSGny3aJNCyIKO0SJoEQZMuaFQgTQKLJjUKInJQQUWjiKBpky5CjSq60DwoCAq0SdIFc1KDgqCUDM3IboYa7u+fnITOfyjEPJwfzgtrsnnX3s+3edfaW+rt7RWkqNHRUYxGo/SVx2azpXzf76RsampKqWF+fp5AIIDRaPzSt7Gxgd1uTwPtHySESKk6OjrE/v6++M6n1+u/9aRaip89emb1P2ympACIRCLJyd3a2hI+n+/HJ/lDbrdblJSUJKutrU2MjIyImZkZAVBZWSnGxsYEQH19vTg8PEyyKO7v70VXVxcAs7OzwuVyYTAYvlxL6SgejyPLMh6PB4/Hw8rKCuXl5ezt7XFwcCD8fj/b29v4/X7h8XioqKhI9ir6+vp4eXlheHhYaDQaJicnMwb6obu7O6xWK1arlYWFBcxmM8fHxzidTrq7u/H7/ezu7lJdXY1arU7yKOfm5ujp6aG9vZ3GxsaMgwLk5+ezuLgIgFqtpri4WJJlWaytrWG32/F6vUxPT9Pa2vqpT1FQUCCtrq4mQY+OjoTb7c5YZgGi0ShOpxOn04nD4QDAZDLh9Xqpq6vDYrFwdnZGQ0PDpz7lXyeVAJaXl4XL5WJqaipjoIWFhfT39xMMBpPgAAMDAzQ3N5OTkyO1tLSI8fFxampqPvVKQ0NDAiAQCGCxWLDZbF9GobOzUwwODmI2m7/0GQwG4fP5fjRWyomJCYQQaLXafyWv6UiZm5v7n4f80B/1BZNKS0tTmvxQKMTOzs63mVUqlUKv16dH9zdJQmR0S/2o/qgYJGGvr69/9BU7HA5xcnLy209RKBT67Tkf18LhsLi9vRWnp6fi6uoq6Ts/PxcA0ubmplAoFEQiEaLRKDqdjtraWjQaTVpbYn19XVRVVfH8/MzFxQV6vR6tVkswGCQejyOE4P39Ha1Wy9vbG3l5eZhMJmlpaUkYjUZkWebm5gadTkc4HEan06F4fn4mkUjw8PBAIBBArVanDQogSRKxWIxEIsHT0xOxWAyVSoUsyxQVFSHLMllZWWRnZ/P6+oosywCoVCoeHx9RqVRJnrKyMi4vL/kF0qbYq1Qf5toAAAAASUVORK5CYII=", "chem": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAXCAYAAACS5bYWAAADc0lEQVR4nMWXPUiqURjH/0dCs1cKycjBRQRDWhwbjbZoqaHNoRJBIipsaFJqKQhNqWiSIKgliKKWGvoQJaihoRw0Eykw+/A1TS2ifO5w7+3i9YOuafcPZ3nf//s+v/Occ55zDjMYDIQKaXx8HCqVipXyGI1GIiovZI1Opyvrw7+1sLCAaDQKlUpV1JNMJml9fR1Op7O8IERUkdbb20sej4dKeRKJBCkUipKeUk1QrBOPj48Vmx6VUlHYYDCIwcHB/wIcj8fJ4/HkxRasrKwUBbq4uIDZbP5W4EgkQgMDA5BIJHnvBMFgEGtrawWBurq60NraCqvV+m3AFosF09PT0Gq1DADS6fRHbIHVamXHx8fY2toqCNTf38/kcjmmpqaqDhwOh0kikUCtVjMAeHh4IL1eDwBwOBwkAICZmRm2v7+P3d3dgkAmk4kJhULYbLaqAp+dnUGr1QIAAoEAmUwmPD09YWRkhBoaGv4sMLvdzjY3N3F4eFgQyGw2s9fXVywuLlYNuLGxEYlEAgcHBzQ5OYn5+XkIhUJ0d3ejr6+P5dSxVCpFBoOBvF4vnZyckNPpzKuJFouFXC5X3vNK1dn29nYaHR2lVCpFRIT7+/sPf07p4jiOORwOuFwu+Hy+gr2fmJhgPp8Pq6urVcnw2NgYMpkMstksAEAmkzEAWFpaopq/zRzHsdnZWdLr9ejo6Cj4Q5vNxoaHh6m2tpZ6enpKngX+VZ2dnUwsFpPRaERzczMBQDQa/clSbDh4nqejo6OSQ2Y0Gml7e5uqtd3yPE+xWOzDn5fZ35JKpaytra1kFux2O4aGhiASiaoyJaRSac6oFd1uPyOO49jc3ByWl5cRi8W+RvYJ1SiVyi9n5deq/ZT35uYG5cZk5R6E/4e+NA2+W3mwV1dXOan2er3k9/u/Lf17e3vkdrtz4oXDYQKAmp2dHbq+voZGowHP88hkMgiFQqTT6VgqlSKO49DU1ISNjQ0Si8W4vb2FXC5HIpFAJpOBTCYDx3HQ6XQVqbeRSAR1dXXw+/0UCAQgEAiQTqfhdrtJ8PLyAo1Gg/PzcySTSXAch1AohLu7O5JIJCwQCOD09BTZbBbPz89Qq9Wor6+HQqFAS0sL3t7eEAqFKsEJAFAqlRCJRPD7/Ugmk3h/fwfP84hGo8Dl5WXBIh2Px8u+K1Wr/QDeB0XQoaXFOAAAAABJRU5ErkJggg==", "hq": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAfCAYAAABgfwTIAAADDklEQVR4nO2WX0hTURzHP/em7W5ZbhC0HtJCy0FIg4iC6kWMegglo8j+mkb5ElGS9s8eCnrpJawgEIqCikkUPkZFvWz9M8imKRVZaFs1G6tN53Te28NxybTcBTfaw74v955zvvd3PvzO75xzJU3TAJg7f662oWkDqVB3Szd1FXVUVlZKU/k6Ojq0+oOlyCmhmKYyUHqVgdKrDJReZcVeoiNR3j98n5JJfB99ur29nvA4VOOJRsJD4ZRAkQ92uz2hzWq1snPvUaTYiZ5OykpsAafTqZlMJiwWCy6XC5vNhtlsZmBggP7+fhRFoaioCEVRMJlMU14leqS70IPBIF6vF4PBgNvtpq+vj1AohCzLGAwGHA5HUoBAZ6by8vKQZcFvNBoJBAIUFBQA4Pf7sVqt+Hz6izmRklZTgUBAM5vNSclUWhZ6Wh6eGSi9ykDpVVpCZWmeRg3/zf/NEacsov1IIz08d8OKpSDL0PYWli2G7Gx9Qfw/wf8LChckB+rP8q2uhnBEvJfWikn06nEbnLo8fZjywxAZTnD39X6FC7dgtR0qSqD9HTTfFRk5tB0+eeByCxjGMhoZhvM3wLYQPnvhyE44dxVO1kDrE/FddDQ+xtVWUFUYicL9p9DyYEKhl9bCmmoIDor27tOQmyOy0NUDlxxgWwQXHfCyE2rOgKbBM7fwN92GRy/A1S7gVBXONouxe4+h48PkGM334M4jMCkgSeIZB9VQBY37QJkp2s7X0PkRRlV4+ga2rYcnbaKGQoMicydroLpc+F91Qe1m0RdT7GpVVfGcGAOEv6pMZHzj2gnLt24VzDJC9lhvbg407BFga+ywfAc8uw77zogNYZkNX75D7zfht8yBLz7o8Yi2LIvligwLH8CW+vgYILIT0+hogpo6Xg1lh8VHrmtQXAibj8LwCHz7AXW7xAYpLoQF82B/BZQcGN+FkgSlK6FokwCGyTEAYv87S/Jh6zGQ1M+1mvTjyj/BggMCasYMsQRDETAZx8cHw/Ht8BCEwlC8Fb4+GO8zjmXjbzFiikZB1eA3JY0cG+2LE3oAAAAASUVORK5CYII="};
  const attachmentInput = document.getElementById('node-attachment-input');
  const insigniaInput = document.getElementById('node-insignia-input');
  const randomBtn = document.getElementById('btn-random-orbat');
  const epInner = document.getElementById('ep-inner');
  let epEquipList, epMissionNote, epIntelNote, epAdminNote, epAttachmentList;

  function ensureUnitFields(){
    if(document.getElementById('ep-equip-list')) return;
    const actionsPsec=[...epInner.querySelectorAll('.psec')].find(el=>el.textContent.trim()==='Actions');
    const wrap=document.createElement('div');
    wrap.innerHTML = `
      <div class="psec">Equipment Layer</div>
      <div class="fg">
        <label>Equipment List</label>
        <textarea id="ep-equip-list" placeholder="3 x Rifle Company\n8 x MBT\n6 x 155mm SPH"></textarea>
        <div class="panel-help">One item per line. Used for doctrine templates and future analysis tools.</div>
      </div>
      <div class="psec">Structured Notes</div>
      <div class="fg"><label>Mission</label><textarea id="ep-mission-note" placeholder="Defend phase line BRONZE"></textarea></div>
      <div class="fg"><label>Intel / Situation</label><textarea id="ep-intel-note" placeholder="Enemy armour sighted east of OBJ ALPHA"></textarea></div>
      <div class="fg"><label>Admin / Logistics</label><textarea id="ep-admin-note" placeholder="Fuel 70%, ammo state green"></textarea></div>
      <div class="psec">Attachments</div>
      <div class="fg">
        <div class="icon-row" style="margin-bottom:6px">
          <button class="pb" id="btn-attach-files" style="margin:0;flex:1">⤒ Add Attachment(s)</button>
          <button class="pb" id="btn-clear-attachments" style="margin:0;width:90px;padding:6px 4px" title="Remove all">Clear</button>
        </div>
        <div id="ep-attachment-list" class="panel-help">No attachments</div>
      </div>
    `;
    epInner.insertBefore(wrap, actionsPsec || epInner.lastElementChild);
    epEquipList=document.getElementById('ep-equip-list');
    epMissionNote=document.getElementById('ep-mission-note');
    epIntelNote=document.getElementById('ep-intel-note');
    epAdminNote=document.getElementById('ep-admin-note');
    epAttachmentList=document.getElementById('ep-attachment-list');
    [epEquipList,epMissionNote,epIntelNote,epAdminNote].forEach(el=>{ if(!el) return; el.addEventListener('input', ()=>{ try{ applyEP(); }catch(e){} }); });
    document.getElementById('btn-attach-files').addEventListener('click', ()=>attachmentInput.click());
    document.getElementById('btn-clear-attachments').addEventListener('click', ()=>{
      if(!selectedId||!nodes[selectedId]) return;
      nodes[selectedId].attachments=[];
      populateEditPanel(selectedId);
      saveState();
      showToast('Attachments cleared');
    }});
  }
  ensureUnitFields();

  function renderAttachmentList(list){
    if(!epAttachmentList) return;
    const items=(list||[]);
    if(!items.length){ epAttachmentList.textContent='No attachments'; return; }
    epAttachmentList.innerHTML=items.map((a,i)=>`<div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:4px"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${a.name||('Attachment '+(i+1))}</span><button class="pb" style="width:auto;margin:0;padding:2px 8px" onclick="window.open('${(a.dataUrl||'').replace(/'/g,"&#39;")}','_blank')">Open</button></div>`).join('');
  }

  const iconTypes = {
    infantry:'infantry', armour:'armour', mech_inf:'armd_recon', motorised:'armour', armd_recon:'armd_recon',
    recon:'recon', airborne:'infantry', air_assault:'aviation', special_ops:'infantry', ranger:'infantry',
    amphibious:'infantry', mountain:'infantry', arctic:'infantry',
    artillery:'artillery', rockets:'rockets', mortar:'mortar', air_defense:'air_defense', ew:'ew', cyber:'ew',
    aviation:'aviation', attack_helo:'attack_helo', fixed_wing:'fixed_wing', uav:'uav', istar:'uav',
    engineer:'engineer', bridging:'engineer', signals:'signals', intel:'intel', log:'log', medical:'medical',
    maintenance:'engineer', mp:'mp', chem:'chem', eod:'engineer', psyops:'ew', cimic:'intel',
    hq:'hq', joint_hq:'hq'
  };
  UT.forEach(ut=>{ const k=iconTypes[ut.id]; if(k && SYMBOL_PACK[k]) ut.symbolDataUrl=SYMBOL_PACK[k]; });

  const oldGetSym = getSym;
  // Assign to window.getSym explicitly so every caller — whether resolving via the
  // lexical function-declaration binding or via window property — gets the patched version.
  window.getSym = getSym = function(typeId, affil='friendly', ech='battalion', planned=false){
    const def = UT.find(u=>u.id===typeId) || customTypes.find(u=>u.id===typeId);
    if(useSymbolPackImages && def && def.symbolDataUrl){
      const c = AC[affil] || AC.friendly;
      const echSvg=ech?`<text x="26" y="5" text-anchor="middle" font-size="7" font-family="monospace" fill="${c.stroke}">${EM[ech]||''}</text>`:'';
      const dash=planned?'stroke-dasharray="4,2"':'';
      const inner=`<image x="8" y="9" width="36" height="26" href="${def.symbolDataUrl}" preserveAspectRatio="xMidYMid meet"/>`;
      if(affil==='hostile')return`<svg viewBox="0 0 52 42" xmlns="http://www.w3.org/2000/svg">${echSvg}${inner}</svg>`;
      if(affil==='neutral'||affil==='unknown')return`<svg viewBox="0 0 52 42" xmlns="http://www.w3.org/2000/svg">${echSvg}${inner}</svg>`;
      return`<svg viewBox="0 0 52 42" xmlns="http://www.w3.org/2000/svg">${echSvg}${inner}</svg>`;
    }
    return oldGetSym(typeId, affil, ech, planned);
  };

  const oldNormalizeNode = normalizeNode;
  normalizeNode = function(id, raw={}){
    const n = oldNormalizeNode(id, raw);
    n.equipmentItems = Array.isArray(raw.equipmentItems) ? raw.equipmentItems : String(raw.equipmentItems||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    n.missionNote = raw.missionNote || '';
    n.intelNote = raw.intelNote || '';
    n.adminNote = raw.adminNote || '';
    n.attachments = Array.isArray(raw.attachments) ? raw.attachments : [];
    return n;
  };

  const oldPopulateEditPanel = populateEditPanel;
  populateEditPanel = function(id){
    oldPopulateEditPanel(id);
    ensureUnitFields();
    const n=nodes[id];
    if(epEquipList) epEquipList.value=(n.equipmentItems||[]).join('\n');
    if(epMissionNote) epMissionNote.value=n.missionNote||'';
    if(epIntelNote) epIntelNote.value=n.intelNote||'';
    if(epAdminNote) epAdminNote.value=n.adminNote||'';
    renderAttachmentList(n.attachments||[]);
  };

  const oldApplyEP = applyEP;
  applyEP = function(){
    oldApplyEP();
    if(!selectedId||!nodes[selectedId]) return;
    const n=nodes[selectedId];
    n.equipmentItems = (epEquipList?.value||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    n.missionNote = epMissionNote?.value || '';
    n.intelNote = epIntelNote?.value || '';
    n.adminNote = epAdminNote?.value || '';
    saveState();
  };

  const oldNodeSearchText = window.nodeSearchText || null;
  if(oldNodeSearchText){
    window.nodeSearchText=function(n){
      return [oldNodeSearchText(n), ...(n.equipmentItems||[]), n.missionNote||'', n.intelNote||'', n.adminNote||''].join(' ').toLowerCase();
    };
  }

  attachmentInput?.addEventListener('change', (e)=>{
    if(!selectedId||!nodes[selectedId]) return;
    const files=[...(e.target.files||[])].slice(0,8);
    if(!files.length) return;
    let pending=files.length;
    files.forEach(file=>{
      const reader=new FileReader();
      reader.onload=ev=>{
        nodes[selectedId].attachments = nodes[selectedId].attachments || [];
        nodes[selectedId].attachments.push({name:file.name, type:file.type||'', dataUrl:ev.target.result});
        pending--;
        if(pending===0){ populateEditPanel(selectedId); saveState(); showToast('Attachment(s) added'); }
      };
      reader.readAsDataURL(file);
    });
    e.target.value='';
  });

  function doctrinalTemplates(){
    return [
      {
        name:'NATO Infantry Battalion',
        desc:'HQ, 4 rifle companies, support company, mortars, logistics',
        fn:()=>{
          const hq=createNode({typeId:'hq',name:'1-22 IN',designation:'1-22 IN',echelon:'battalion',x:340,y:60,equipmentItems:['4 x Rifle Company','1 x Support Company','1 x Mortar Platoon']});
          ['A COY','B COY','C COY','D COY'].forEach((nm,i)=>createNode({typeId:'infantry',name:nm,echelon:'company',parentId:hq,x:60+i*170,y:220,equipmentItems:['3 x Rifle Platoon','1 x Weapons Platoon']}));
          createNode({typeId:'mortar',name:'MORTAR PLT',echelon:'company',parentId:hq,x:760,y:220,reltype:'support'});
          createNode({typeId:'log',name:'SUPPORT COY',echelon:'company',parentId:hq,x:930,y:220,reltype:'support'});
          autoLayout();
        }
      },
      {
        name:'Armoured Brigade',
        desc:'HQ, tank battalions, mechanized infantry, artillery, engineers, logistics',
        fn:()=>{
          const hq=createNode({typeId:'hq',name:'1 ARMD BDE',designation:'1 ARMD BDE',echelon:'brigade',x:360,y:60,equipmentItems:['3 x Tank Battalion','2 x Mechanized Infantry Battalion']});
          createNode({typeId:'armour',name:'1 TANK BN',echelon:'battalion',parentId:hq,x:40,y:220,equipmentItems:['58 x MBT']});
          createNode({typeId:'armour',name:'2 TANK BN',echelon:'battalion',parentId:hq,x:220,y:220,equipmentItems:['58 x MBT']});
          createNode({typeId:'armour',name:'3 TANK BN',echelon:'battalion',parentId:hq,x:400,y:220,equipmentItems:['58 x MBT']});
          createNode({typeId:'mech_inf',name:'1 MECH BN',echelon:'battalion',parentId:hq,x:580,y:220,equipmentItems:['44 x IFV/APC']});
          createNode({typeId:'mech_inf',name:'2 MECH BN',echelon:'battalion',parentId:hq,x:760,y:220,equipmentItems:['44 x IFV/APC']});
          createNode({typeId:'artillery',name:'BDE ARTY',echelon:'battalion',parentId:hq,x:940,y:220});
          createNode({typeId:'engineer',name:'ENGR COY',echelon:'company',parentId:hq,x:1120,y:220,reltype:'support'});
          createNode({typeId:'log',name:'BDE SPT BN',echelon:'battalion',parentId:hq,x:1300,y:220,reltype:'support'});
          autoLayout();
        }
      },
      {
        name:'Russian BTG',
        desc:'Motor rifle core with tanks, artillery, air defense and support',
        fn:()=>{
          const hq=createNode({typeId:'hq',name:'BTG',designation:'BTG',echelon:'battalion',affil:'hostile',x:340,y:60});
          createNode({typeId:'motorised',name:'MR COY A',echelon:'company',parentId:hq,affil:'hostile',x:60,y:220});
          createNode({typeId:'motorised',name:'MR COY B',echelon:'company',parentId:hq,affil:'hostile',x:220,y:220});
          createNode({typeId:'motorised',name:'MR COY C',echelon:'company',parentId:hq,affil:'hostile',x:380,y:220});
          createNode({typeId:'armour',name:'TANK COY',echelon:'company',parentId:hq,affil:'hostile',x:540,y:220});
          createNode({typeId:'artillery',name:'ARTY BTRY',echelon:'company',parentId:hq,affil:'hostile',x:700,y:220});
          createNode({typeId:'rockets',name:'MLRS SEC',echelon:'company',parentId:hq,affil:'hostile',x:860,y:220,reltype:'support'});
          createNode({typeId:'air_defense',name:'SHORAD',echelon:'company',parentId:hq,affil:'hostile',x:1020,y:220,reltype:'support'});
          createNode({typeId:'engineer',name:'ENGR PLT',echelon:'platoon',parentId:hq,affil:'hostile',x:1180,y:220,reltype:'support'});
          autoLayout();
        }
      },
      {
        name:'US Brigade Combat Team',
        desc:'HQ, 3 maneuver battalions, cavalry, artillery, engineer, sustainment',
        fn:()=>{
          const hq=createNode({typeId:'hq',name:'1 BCT',designation:'1 BCT',echelon:'brigade',x:340,y:60});
          createNode({typeId:'infantry',name:'1-22 IN',echelon:'battalion',parentId:hq,x:40,y:220});
          createNode({typeId:'infantry',name:'2-22 IN',echelon:'battalion',parentId:hq,x:220,y:220});
          createNode({typeId:'armour',name:'1-66 AR',echelon:'battalion',parentId:hq,x:400,y:220});
          createNode({typeId:'recon',name:'SQDN',echelon:'battalion',parentId:hq,x:580,y:220});
          createNode({typeId:'artillery',name:'FA BN',echelon:'battalion',parentId:hq,x:760,y:220});
          createNode({typeId:'engineer',name:'EN BN',echelon:'battalion',parentId:hq,x:940,y:220});
          createNode({typeId:'log',name:'BSB',echelon:'battalion',parentId:hq,x:1120,y:220,reltype:'support'});
          autoLayout();
        }
      },
      {
        name:'PLA Combined Arms Brigade',
        desc:'HQ, combined arms battalions, artillery, air defense, service support',
        fn:()=>{
          const hq=createNode({typeId:'hq',name:'CA BDE',designation:'CA BDE',echelon:'brigade',x:340,y:60});
          ['1 CABN','2 CABN','3 CABN','4 CABN'].forEach((nm,i)=>createNode({typeId:i<2?'mech_inf':'armour',name:nm,echelon:'battalion',parentId:hq,x:40+i*180,y:220}));
          createNode({typeId:'artillery',name:'ARTY BN',echelon:'battalion',parentId:hq,x:780,y:220});
          createNode({typeId:'air_defense',name:'AD BN',echelon:'battalion',parentId:hq,x:960,y:220});
          createNode({typeId:'engineer',name:'ENGR BN',echelon:'battalion',parentId:hq,x:1140,y:220});
          createNode({typeId:'log',name:'SVC SPT BN',echelon:'battalion',parentId:hq,x:1320,y:220,reltype:'support'});
          autoLayout();
        }
      }
    ];
  }

  // replace old template set with doctrinal templates
  TEMPLATES.splice(0, TEMPLATES.length, ...doctrinalTemplates());

  function randomOrbat(){
    if(Object.keys(nodes).length>0 && !confirm('Generate random doctrinal ORBAT? This clears the current ORBAT.')) return;
    clearAll(true);
    const pool=doctrinalTemplates();
    const tpl=pool[Math.floor(Math.random()*pool.length)];
    tpl.fn();
    document.getElementById('op-name-input').value='OPERATION '+['IRON LANCE','BLUE OAK','STEEL ECHO','SILENT DUNE','RED TALON'][Math.floor(Math.random()*5)];
    saveState();
    showToast('Random ORBAT: '+tpl.name);
  }

  randomBtn?.addEventListener('click', randomOrbat);

  syncIconModeBtn();
  buildPalette();
  Object.keys(nodes).forEach(id=>renderNode(id));
  if(selectedId) populateEditPanel(selectedId);
  showToast('Doctrinal templates and symbol pack loaded');
})();
