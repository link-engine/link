import * as builder from "../generators.js";

let points = [

    -2.447973, 0.125932,
    -6.304742, 3.307700,
    -10.161890, 6.488986,
    -14.019368, 9.669851,
    -17.877125, 12.850358,
    -21.735112, 16.030570,
    -25.593279, 19.210548,
    -29.451575, 22.390356,
    -33.309951, 25.570056,
    -37.168356, 28.749710,
    -41.026742, 31.929380,
    -44.885057, 35.109130,
    -48.743252, 38.289022,
    -52.601276, 41.469117,
    -56.459081, 44.649479,
    -60.316615, 47.830170,
    -64.173829, 51.011253,
    -68.030674, 54.192789,
    -71.887098, 57.374842,
    -75.743052, 60.557474,
    -79.598514, 63.740712,
    -83.453522, 66.924512,
    -87.308120, 70.108817,
    -91.162354, 73.293572,
    -95.016269, 76.478722,
    -98.869911, 79.664212,
    -102.723325, 82.849985,
    -106.576556, 86.035987,
    -110.429650, 89.222163,
    -114.282652, 92.408456,
    -118.135606, 95.594811,
    -121.988559, 98.781173,
    -125.841556, 101.967486,
    -129.694642, 105.153696,
    -133.547862, 108.339746,
    -137.401262, 111.525581,
    -141.254887, 114.711146,
    -145.108782, 117.896385,
    -148.962993, 121.081243,
    -152.817564, 124.265665,
    -156.672542, 127.449595,
    -160.527972, 130.632977,
    -164.383898, 133.815757,
    -168.240367, 136.997878,
    -172.097422, 140.179286,
    -175.955111, 143.359924,
    -179.813478, 146.539739,
    -183.672565, 149.718677,
    -187.532370, 152.896741,
    -191.392858, 156.073974,
    -195.253994, 159.250418,
    -199.115741, 162.426117,
    -202.978064, 165.601114,
    -206.840927, 168.775452,
    -210.704295, 171.949174,
    -214.568131, 175.122324,
    -218.432401, 178.294943,
    -222.297067, 181.467076,
    -226.162096, 184.638766,
    -230.027450, 187.810056,
    -233.893094, 190.980988,
    -237.758993, 194.151607,
    -241.625110, 197.321954,
    -245.491411, 200.492074,
    -249.357858, 203.662009,
    -253.224417, 206.831803,
    -257.091052, 210.001499,
    -260.957727, 213.171139,
    -264.824406, 216.340767,
    -268.691054, 219.510426,
    -272.557634, 222.680160,
    -276.424112, 225.850011,
    -280.290451, 229.020022,
    -284.156616, 232.190236,
    -288.022571, 235.360698,
    -291.888275, 238.531456,
    -295.753682, 241.702568,
    -299.618746, 244.874092,
    -303.483421, 248.046085,
    -307.347660, 251.218606,
    -311.211416, 254.391711,
    -315.074644, 257.565460,
    -318.937296, 260.739910,
    -322.799327, 263.915119,
    -326.660689, 267.091144,
    -330.521337, 270.268044,
    -334.381224, 273.445876,
    -338.240304, 276.624699,
    -342.098530, 279.804569,
    -345.955855, 282.985545,
    -349.812234, 286.167685,
    -353.667620, 289.351046,
    -357.521967, 292.535687,
    -361.375227, 295.721665,
    -365.227355, 298.909038,
    -369.078304, 302.097864,
    -372.928028, 305.288201,
    -376.776481, 308.480107,
    -380.623615, 311.673639,
    -384.469385, 314.868855,
    -388.313744, 318.065813,
    -392.156645, 321.264572,
    -395.998121, 324.465093,
    -399.838735, 327.666695,
    -403.679272, 330.868423,
    -407.520518, 334.069327,
    -411.363260, 337.268451,
    -415.208282, 340.464843,
    -419.056372, 343.657550,
    -422.908315, 346.845619,
    -426.764897, 350.028095,
    -430.626905, 353.204027,
    -434.495123, 356.372461,
    -438.370339, 359.532444,
    -442.253338, 362.683022,
    -446.144848, 365.823305,
    -450.036704, 368.961893,
    -453.902415, 372.126954,
    -457.713227, 375.349068,
    -461.440385, 378.658817,
    -465.055136, 382.086781,
    -468.528725, 385.663542,
    -471.829712, 389.420173,
    -474.840145, 393.403578,
    -477.339111, 397.679507,
    -479.099684, 402.314808,
    -479.907693, 407.327013,
    -479.633397, 412.407195,
    -478.181363, 417.113767,
    -475.476929, 421.030756,
    -471.702783, 424.065828,
    -467.216113, 426.346097,
    -462.377407, 428.002842,
    -457.475225, 429.162331,
    -452.557456, 429.934061,
    -447.621711, 430.424025,
    -442.665714, 430.736615,
    -437.690326, 430.931693,
    -432.699884, 431.019809,
    -427.698904, 431.008956,
    -422.691902, 430.907127,
    -417.683395, 430.722313,
    -412.677899, 430.462509,
    -407.679727, 430.135286,
    -402.690808, 429.743284,
    -397.711513, 429.285923,
    -392.742188, 428.762567,
    -387.783178, 428.172580,
    -382.834827, 427.515328,
    -377.897482, 426.790176,
    -372.971487, 425.996487,
    -368.057188, 425.133627,
    -363.154929, 424.200961,
    -358.265057, 423.197853,
    -353.387915, 422.123667,
    -348.523850, 420.977770,
    -343.673207, 419.759524,
    -338.837504, 418.466799,
    -334.022115, 417.092547,
    -329.233206, 415.628708,
    -324.476942, 414.067225,
    -319.759488, 412.400040,
    -315.087010, 410.619094,
    -310.465656, 408.716374,
    -305.899830, 406.688321,
    -301.390698, 404.539636,
    -296.939079, 402.275914,
    -292.545791, 399.902748,
    -288.211651, 397.425734,
    -283.937477, 394.850466,
    -279.723988, 392.182566,
    -275.569281, 389.428390,
    -271.468618, 386.595086,
    -267.417121, 383.689841,
    -263.409910, 380.719842,
    -259.442108, 377.692276,
    -255.508837, 374.614330,
    -251.605217, 371.493192,
    -247.726370, 368.336049,
    -243.867417, 365.150087,
    -240.023481, 361.942494,
    -236.189682, 358.720457,
    -232.361143, 355.491164,
    -228.532983, 352.261801,
    -224.700912, 349.038693,
    -220.864076, 345.823103,
    -217.022878, 342.614446,
    -213.177719, 339.412138,
    -209.329002, 336.215594,
    -205.477131, 333.024228,
    -201.622507, 329.837456,
    -197.765535, 326.654691,
    -193.906616, 323.475349,
    -190.046153, 320.298845,
    -186.184548, 317.124593,
    -182.322206, 313.952008,
    -178.459528, 310.780505,
    -174.596918, 307.609499,
    -170.734777, 304.438403,
    -166.873509, 301.266635,
    -163.013517, 298.093607,
    -159.155203, 294.918735,
    -155.298969, 291.741433,
    -151.445220, 288.561117,
    -147.594357, 285.377200,
    -143.746783, 282.189099,
    -139.902902, 278.996227,
    -136.063115, 275.798000,
    -132.227826, 272.593831,
    -128.397437, 269.383137,
    -124.572351, 266.165331,
    -120.752922, 262.939885,
    -116.935008, 259.711446,
    -113.106377, 256.493970,
    -109.253955, 253.302387,
    -105.364667, 250.151626,
    -101.425438, 247.056616,
    -97.423192, 244.032286,
    -93.344134, 241.096585,
    -89.156159, 238.344015,
    -84.807867, 235.949797,
    -80.246933, 234.093003,
    -75.441119, 232.926849,
    -70.473071, 232.456639,
    -65.466214, 232.635181,
    -60.537224, 233.412752,
    -55.729014, 234.712875,
    -51.039295, 236.442673,
    -46.465145, 238.509059,
    -42.038061, 240.864345,
    -37.895069, 243.600025,
    -34.193347, 246.834173,
    -31.060135, 250.649617,
    -28.459319, 254.936859,
    -26.299344, 259.521128,
    -24.489162, 264.228580,
    -22.980929, 268.961754,
    -21.800153, 273.752888,
    -20.979471, 278.646792,
    -20.556339, 283.657835,
    -20.582456, 288.710457,
    -21.112138, 293.712570,
    -22.195392, 298.575007,
    -23.785175, 303.274431,
    -25.738474, 307.852600,
    -27.908191, 312.354042,
    -30.164130, 316.818412,
    -32.465715, 321.259529,
    -34.801961, 325.682679,
    -37.161898, 330.093141,
    -39.534562, 334.496199,
    -41.908983, 338.897132,
    -44.274199, 343.301219,
    -46.622815, 347.712224,
    -48.957805, 352.129502,
    -51.284017, 356.551612,
    -53.606297, 360.977116,
    -55.929491, 365.404573,
    -58.258446, 369.832543,
    -60.597902, 374.259598,
    -62.944947, 378.685147,
    -65.284012, 383.109980,
    -67.598343, 387.535019,
    -69.867340, 391.964711,
    -72.032044, 396.438694,
    -74.011463, 401.016827,
    -75.722430, 405.755983,
    -77.040058, 410.642511,
    -77.798881, 415.594165,
    -77.831755, 420.525868,
    -77.025624, 425.365480,
    -75.547607, 430.107893,
    -73.655270, 434.769638,
    -71.591161, 439.366816,
    -69.451573, 443.911266,
    -67.250552, 448.412429,
    -65.001228, 452.879721,
    -62.716733, 457.322554,
    -60.410196, 461.750344,
    -58.094747, 466.172506,
    -55.781744, 470.597177,
    -53.473480, 475.025974,
    -51.169368, 479.458440,
    -48.868820, 483.894117,
    -46.571248, 488.332547,
    -44.276063, 492.773272,
    -41.982675, 497.215833,
    -39.690497, 501.659774,
    -37.398940, 506.104635,
    -35.107416, 510.549960,
    -32.815335, 514.995289,
    -30.522109, 519.440164,
    -28.227150, 523.884129,
    -25.929873, 528.326726,
    -23.629945, 532.767694,
    -21.327441, 537.207075,
    -19.022467, 541.644940,
    -16.715132, 546.081359,
    -14.405547, 550.516403,
    -12.093818, 554.950142,
    -9.780055, 559.382647,
    -7.464367, 563.813989,
    -5.146862, 568.244238,
    -2.827649, 572.673464,
    -0.506836, 577.101738,
    1.815467, 581.529131,
    4.139152, 585.955714,
    6.464111, 590.381556,
    8.790234, 594.806729,
    11.117413, 599.231303,
    13.445539, 603.655348,
    15.774504, 608.078935,
    18.104199, 612.502135,
    20.434515, 616.925018,
    22.765344, 621.347655,
    25.096576, 625.770116,
    27.428103, 630.192472,
    29.759817, 634.614794,
    32.091608, 639.037151,
    34.423369, 643.459615,
    36.754989, 647.882256,
    39.086336, 652.305157,
    41.417032, 656.728518,
    43.746566, 661.152603,
    46.074428, 665.577677,
    48.400107, 670.004003,
    50.723090, 674.431848,
    53.042867, 678.861474,
    55.358927, 683.293148,
    57.670758, 687.727133,
    59.977848, 692.163694,
    62.279687, 696.603096,
    64.575763, 701.045603,
    66.865565, 705.491481,
    69.148587, 709.940990,
    71.427741, 714.392430,
    73.715266, 718.838748,
    76.024978, 723.271988,
    78.370691, 727.684191,
    80.766220, 732.067401,
    83.225380, 736.413660,
    85.761847, 740.715088,
    88.380759, 744.968470,
    91.073944, 749.177870,
    93.832073, 753.347983,
    96.645818, 757.483504,
    99.505850, 761.589128,
    102.402841, 765.669552,
    105.327929, 769.729153,
    108.281543, 773.766030,
    111.272647, 777.772503,
    114.310522, 781.740681,
    117.404452, 785.662670,
    120.563718, 789.530579,
    123.797602, 793.336515,
    127.115229, 797.072374,
    130.524272, 800.728101,
    134.031622, 804.292597,
    137.644081, 807.754825,
    141.319620, 811.149192,
    144.885071, 814.632140,
    148.145483, 818.380386,
    150.924457, 822.532124,
    153.135526, 827.038832,
    154.719435, 831.795494,
    155.618206, 836.697477,
    155.847252, 841.662957,
    155.534025, 846.644926,
    154.815403, 851.599345,
    153.818057, 856.498417,
    152.641850, 861.357029,
    151.382293, 866.196999,
    150.131780, 871.039424,
    148.923688, 875.891795,
    147.738651, 880.749442,
    146.555603, 885.607306,
    145.362156, 890.462429,
    144.159008, 895.315024,
    142.947943, 900.165565,
    141.730742, 905.014525,
    140.509188, 909.862379,
    139.285064, 914.709600,
    138.060151, 919.556665,
    136.836232, 924.404045,
    135.615091, 929.252216,
    134.398508, 934.101652,
    133.188267, 938.952827,
    131.986150, 943.806216,
    130.793939, 948.662292,
    129.612733, 953.521352,
    128.437594, 958.382134,
    127.260449, 963.242564,
    126.073196, 968.100559,
    124.867732, 972.954039,
    123.635955, 977.800922,
    122.369763, 982.639127,
    121.069286, 987.468356,
    119.773197, 992.296667,
    118.531446, 997.134565,
    117.393982, 1001.992550,
    116.410758, 1006.881126,
    115.631723, 1011.810796,
    115.106854, 1016.792020,
    114.897835, 1021.815771,
    115.096521, 1026.822808,
    115.799557, 1031.745913,
    117.098168, 1036.519258,
    118.985355, 1041.102215,
    121.368719, 1045.476065,
    124.153015, 1049.622818,
    127.253716, 1053.526452,
    130.634716, 1057.179826,
    134.273579, 1060.578305,
    138.147866, 1063.717255,
    142.235141, 1066.592040,
    146.512966, 1069.198028,
    150.958903, 1071.530563,
    155.549905, 1073.577798,
    160.261421, 1075.310058,
    165.068670, 1076.694954,
    169.946871, 1077.700095,
    174.871243, 1078.293092,
    179.817006, 1078.441556,
    184.759232, 1078.113682,
    189.666066, 1077.305442,
    194.495866, 1076.052042,
    199.206251, 1074.391653,
    203.761373, 1072.366764,
    208.178287, 1070.054798,
    212.499681, 1067.550108,
    216.766998, 1064.944153,
    220.998250, 1062.278686,
    225.192187, 1059.554591,
    229.346989, 1056.771539,
    233.460832, 1053.929200,
    237.531896, 1051.027244,
    241.558358, 1048.065341,
    245.538397, 1045.043163,
    249.470191, 1041.960379,
    253.351919, 1038.816660,
    257.181757, 1035.611677,
    260.957886, 1032.345099,
    264.678482, 1029.016598,
    268.341725, 1025.625843,
    271.946867, 1022.173418,
    275.497753, 1018.663805,
    278.999454, 1015.102529,
    282.457043, 1011.495114,
    285.875592, 1007.847085,
    289.260171, 1004.163966,
    292.615853, 1000.451281,
    295.947709, 996.714555,
    299.260811, 992.959312,
    302.560231, 989.191077,
    305.851040, 985.415374,
    309.138310, 981.637728,
    312.427113, 977.863663,
    315.722466, 974.098640,
    319.027000, 970.345347,
    322.340089, 966.602683,
    325.660869, 962.869275,
    328.988478, 959.143747,
    332.322052, 955.424726,
    335.660728, 951.710838,
    339.003644, 948.000707,
    342.349937, 944.292961,
    345.698743, 940.586224,
    349.049201, 936.879122,
    352.400446, 933.170281,
    355.751617, 929.458327,
    359.101850, 925.741885,
    362.450020, 922.019354,
    365.783745, 918.279296,
    369.075359, 914.496930,
    372.296106, 910.646521,
    375.386764, 906.696200,
    378.051000, 902.566347,
    379.881343, 898.154960,
    380.491758, 893.374423,
    379.838459, 888.362098,
    378.147379, 883.432652,
    375.651759, 878.905554,
    372.585921, 874.990700,
    369.188588, 871.452143,
    365.699601, 867.940558,
    362.411645, 864.131126,
    360.005231, 859.878883,
    359.183189, 855.157056,
    359.564661, 850.213306,
    360.488704, 845.301439,
    361.713443, 840.430399,
    363.051428, 835.577416,
    364.350203, 830.723875,
    365.591182, 825.867052,
    366.787793, 821.008027,
    367.953463, 816.147879,
    369.101622, 811.287688,
    370.245696, 806.428532,
    371.399086, 801.571487,
    372.570266, 796.717114,
    373.757203, 791.864871,
    374.956518, 787.014076,
    376.164828, 782.164046,
    377.378752, 777.314098,
    378.594910, 772.463551,
    379.809919, 767.611721,
    381.020398, 762.757925,
    382.222967, 757.901483,
    383.414243, 753.041710,
    384.590846, 748.177924,
    385.749394, 743.309443,
    386.886506, 738.435585,
    388.001458, 733.556465,
    389.130492, 728.683312,
    390.336940, 723.835500,
    391.684760, 719.032589,
    393.240345, 714.300123,
    395.079306, 709.686234,
    397.279426, 705.244382,
    399.916564, 701.027625,
    403.001099, 697.075284,
    406.463331, 693.409881,
    410.228678, 690.052915,
    414.230787, 687.036249,
    418.459499, 684.462534,
    422.928144, 682.464013,
    427.645901, 681.155773,
    432.565604, 680.423258,
    437.600043, 679.988694,
    442.661154, 679.570825,
    447.679639, 678.961576,
    452.654573, 678.219516,
    457.600599, 677.463925,
    462.531524, 676.798669,
    467.455561, 676.224644,
    472.378631, 675.700550,
    477.306650, 675.184961,
    482.245530, 674.636447,
    487.201188, 674.013582,
    492.179536, 673.274938,
    497.173865, 672.376461,
    502.131722, 671.264578,
    506.990302, 669.883564,
    511.686797, 668.177692,
    516.158401, 666.091236,
    520.342307, 663.568469,
    524.175811, 660.553971,
    527.610349, 657.033846,
    530.625710, 653.077497,
    533.205074, 648.764271,
    535.331617, 644.173517,
    536.988518, 639.384585,
    538.158953, 634.476824,
    538.827607, 629.528382,
    539.024042, 624.581631,
    538.829278, 619.637926,
    538.327159, 614.696369,
    537.601529, 609.756060,
    536.736233, 604.816100,
    535.815116, 599.875592,
    534.917661, 594.933720,
    534.069414, 589.990709,
    533.259521, 585.047481,
    532.476448, 580.104974,
    531.708660, 575.164126,
    530.944623, 570.225873,
    530.172802, 565.291154,
    529.383204, 560.360705,
    528.575530, 555.434018,
    527.753241, 550.510098,
    526.919807, 545.587949,
    526.078695, 540.666576,
    525.233376, 535.744983,
    524.387317, 530.822175,
    523.543989, 525.897156,
    522.706861, 520.968931,
    521.879400, 516.036504,
    521.065077, 511.098880,
    520.267361, 506.155063,
    519.489720, 501.204058,
    518.735623, 496.244869,
    518.012757, 491.276991,
    517.355108, 486.302967,
    516.806786, 481.326519,
    516.411921, 476.351369,
    516.214644, 471.381239,
    516.259084, 466.419851,
    516.589371, 461.470928,
    517.236702, 456.540277,
    518.188446, 451.640769,
    519.422693, 446.786770,
    520.917533, 441.992646,
    522.651058, 437.272763,
    524.601357, 432.641489,
    526.746496, 428.113087,
    529.061645, 423.690505,
    531.516496, 419.355246,
    534.080124, 415.086421,
    536.721610, 410.863141,
    539.410031, 406.664516,
    542.114466, 402.469659,
    544.804639, 398.258151,
    547.468095, 394.022567,
    550.112003, 389.769790,
    552.744538, 385.507436,
    555.373878, 381.243125,
    558.008198, 376.984472,
    560.655677, 372.739096,
    563.323685, 368.513821,
    566.010165, 364.306176,
    568.706935, 360.107654,
    571.405713, 355.909646,
    574.098213, 351.703541,
    576.776152, 347.480732,
    579.431245, 343.232608,
    582.048751, 338.949617,
    584.575114, 334.616521,
    586.942344, 330.215973,
    589.082424, 325.730621,
    590.927339, 321.143113,
    592.409074, 316.436097,
    593.459621, 311.592226,
    594.040751, 306.611592,
    594.210659, 301.550756,
    594.047023, 296.477688,
    593.625431, 291.459018,
    592.966401, 286.525994,
    592.031185, 281.671790,
    590.778105, 276.887697,
    589.172657, 272.170647,
    587.222425, 267.550656,
    584.950291, 263.069770,
    582.379307, 258.769734,
    579.546586, 254.662294,
    576.514739, 250.704786,
    573.349066, 246.848810,
    570.103760, 243.054207,
    566.797603, 239.307116,
    563.442332, 235.598904,
    560.049687, 231.920938,
    556.631404, 228.264586,
    553.199222, 224.621216,
    549.764833, 220.982226,
    546.335580, 217.342045,
    542.910977, 213.700556,
    539.489714, 210.058215,
    536.070482, 206.415477,
    532.651974, 202.772797,
    529.232880, 199.130630,
    525.811919, 195.489421,
    522.388519, 191.849350,
    518.962855, 188.210317,
    515.535138, 184.572207,
    512.105580, 180.934908,
    508.674391, 177.298304,
    505.241785, 173.662282,
    501.807971, 170.026728,
    498.373161, 166.391528,
    494.937567, 162.756569,
    491.501400, 159.121736,
    488.064872, 155.486916,
    484.628192, 151.851994,
    481.191575, 148.216857,
    477.755229, 144.581391,
    474.319368, 140.945481,
    470.884201, 137.309015,
    467.449941, 133.671878,
    464.016800, 130.033956,
    460.584987, 126.395136,
    457.154715, 122.755303,
    453.726196, 119.114343,
    450.299640, 115.472144,
    446.875258, 111.828590,
    443.453263, 108.183568,
    440.033866, 104.536964,
    436.617277, 100.888664,
    433.203707, 97.238556,
    429.793161, 93.586626,
    426.385286, 89.933039,
    422.979693, 86.277978,
    419.575991, 82.621626,
    416.173791, 78.964165,
    412.772704, 75.305777,
    409.372338, 71.646646,
    405.972305, 67.986954,
    402.572215, 64.326883,
    399.171678, 60.666617,
    395.770303, 57.006338,
    392.367702, 53.346228,
    388.963484, 49.686471,
    385.557260, 46.027248,
    382.148640, 42.368743,
    378.737234, 38.711139,
    375.322652, 35.054617,
    371.904504, 31.399361,
    368.482401, 27.745552,
    365.055953, 24.093375,
    361.624769, 20.443011,
    358.188461, 16.794643,
    354.746638, 13.148454,
    351.298911, 9.504626,
    347.844889, 5.863342,
    344.384184, 2.224785,
    340.916404, -1.410863,
    337.431516, -5.025352,
    333.815985, -8.406554,
    329.893377, -11.224519,
    325.486453, -13.147695,
    320.541690, -13.937807,
    315.379942, -13.638828,
    310.392599, -12.347910,
    305.906007, -10.176935,
    301.897689, -7.316781,
    298.228724, -3.984689,
    294.760632, -0.397033,
    291.393212, 3.295380,
    288.090140, 7.051140,
    284.821153, 10.839221,
    281.562452, 14.635315,
    278.309067, 18.434707,
    275.059442, 22.236231,
    271.812021, 26.038722,
    268.565248, 29.841014,
    265.317567, 33.641942,
    262.067423, 37.440340,
    258.813259, 41.235043,
    255.553519, 45.024886,
    252.286648, 48.808702,
    249.011090, 52.585326,
    245.725289, 56.353593,
    242.427688, 60.112338,
    239.116488, 63.860113,
    235.784483, 67.589261,
    232.419194, 71.286060,
    229.007921, 74.936535,
    225.537963, 78.526711,
    221.996619, 82.042613,
    218.371190, 85.470266,
    214.649188, 88.795926,
    210.833182, 92.022149,
    206.950486, 95.178282,
    203.030717, 98.296168,
    199.103494, 101.407648,
    195.198433, 104.544562,
    191.345153, 107.738753,
    187.570645, 111.019168,
    183.844959, 114.352006,
    180.083063, 117.642762,
    176.197668, 120.794447,
    172.110853, 123.696727,
    167.793330, 126.169962,
    163.231551, 128.012089,
    158.419316, 129.046073,
    153.422223, 129.339762,
    148.346475, 129.099500,
    143.298711, 128.533094,
    138.365887, 127.760917,
    133.579519, 126.657078,
    128.961431, 125.052644,
    124.542347, 122.811286,
    120.397679, 119.960460,
    116.616840, 116.578940,
    113.289253, 112.745518,
    110.504336, 108.538987,
    108.351511, 104.038140,
    106.920127, 99.321768,
    106.262870, 94.467605,
    106.335756, 89.550609,
    107.079055, 84.645281,
    108.433038, 79.826125,
    110.337975, 75.167643,
    112.734137, 70.744337,
    115.561733, 66.629746,
    118.757704, 62.845404,
    122.254131, 59.335462,
    125.982696, 56.037776,
    129.875082, 52.890203,
    133.862974, 49.830599,
    137.878054, 46.796820,
    141.854367, 43.728859,
    145.768587, 40.605267,
    149.634394, 37.438064,
    153.466694, 34.240383,
    157.280397, 31.025356,
    161.090410, 27.806116,
    164.911640, 24.595796,
    168.757449, 21.406216,
    172.627993, 18.237975,
    176.516725, 15.085983,
    180.417049, 11.945107,
    184.322367, 8.810211,
    188.226082, 5.676160,
    192.121596, 2.537821,
    196.002659, -0.609738,
    199.869236, -3.767804,
    203.726648, -6.934525,
    207.580390, -10.107943,
    211.435959, -13.286104,
    215.298850, -16.467053,
    219.174560, -19.648832,
    223.056855, -22.838108,
    226.840135, -26.114594,
    230.368764, -29.594780,
    233.486879, -33.395287,
    236.095415, -37.577590,
    238.236600, -42.065971,
    239.974266, -46.763734,
    241.361439, -51.585068,
    242.404829, -56.490799,
    243.098744, -61.454248,
    243.437488, -66.448735,
    243.415368, -71.447580,
    243.026689, -76.424104,
    242.265771, -81.351626,
    241.130824, -86.203421,
    239.629237, -90.952659,
    237.769724, -95.572491,
    235.560996, -100.036071,
    233.011767, -104.316551,
    230.130748, -108.387085,
    226.926832, -112.220803,
    223.416382, -115.789847,
    219.625800, -119.065039,
    215.582189, -122.017105,
    211.312654, -124.616774,
    206.844302, -126.834772,
    202.204236, -128.641827,
    197.419916, -130.010257,
    192.524226, -130.936741,
    187.554290, -131.436999,
    182.547344, -131.527254,
    177.540627, -131.223734,
    172.571375, -130.542664,
    167.676825, -129.500269,
    162.890798, -128.114063,
    158.221647, -126.411152,
    153.666219, -124.422979,
    149.221304, -122.181008,
    144.883694, -119.716700,
    140.650180, -117.061519,
    136.517552, -114.246929,
    132.480359, -111.302782,
    128.524174, -108.252490,
    124.632327, -105.117854,
    120.788149, -101.920677,
    116.974969, -98.682760,
    113.176119, -95.425905,
    109.374927, -92.171912,
    105.556489, -88.940282,
    101.718878, -85.733562,
    97.865964, -82.546733,
    94.001641, -79.374743,
    90.129808, -76.212537,
    86.254359, -73.055062,
    82.379191, -69.897263,
    78.507483, -66.735016,
    74.639573, -63.567879,
    70.775090, -60.396326,
    66.913666, -57.220830,
    63.054933, -54.041864,
    59.198520, -50.859901,
    55.344060, -47.675415,
    51.491183, -44.488879,
    47.639520, -41.300765,
    43.788704, -38.111548,
    39.938363, -34.921700,
    36.088131, -31.731694,
    32.237637, -28.542005,
    28.386518, -25.353098,
    24.534584, -22.165217,
    20.681872, -18.978319,
    16.828429, -15.792341,
    12.974308, -12.607221,
    9.119557, -9.422896,
    5.264226, -6.239304,
    1.408366, -3.056382,
    -2.447973, 0.125932,
    -6.304742, 3.307700,
    -10.161890, 6.488986,
    -17.877125, 12.850358,
]

function create(context) {

    let scene = builder.createScene();
    let root = builder.generateEmpty();
    let lights = builder.generateLights();
    let car, oppCar;
    if (context.activeCar === "orange") {
        car = builder.generateCar("car", "orange");
        builder.addEnv(scene, "carColor", "string", "orange")

    }
    else {
        car = builder.generateCar("car", "green");
        builder.addEnv(scene, "carColor", "string", "green")

    }

    if (context.opponentCar === "green") {
        oppCar = builder.generateCar("oppCar", "green");
        builder.addEnv(scene, "oppColor", "string", "green")
    }
    else {
        oppCar = builder.generateCar("oppCar", "orange");
        builder.addEnv(scene, "oppColor", "string", "orange")

    }

    let checkPointCounter = 0

    for (let i = 320; i < points.length - 1; i += 320) {

        let agilityPowerup = builder.generatePowerup("agility");
        agilityPowerup.position.x = points[i] * 0.8 - 75;
        agilityPowerup.position.z = points[i + 1] * 0.8 - 350;
        agilityPowerup.position.y = 7;

        assignController(agilityPowerup, "powerup")
        assignLayer(agilityPowerup, 3)

        let strengthPowerup = builder.generatePowerup("strength");
        strengthPowerup.position.x = points[i + 80] * 0.8 - 75;
        strengthPowerup.position.z = points[i + 81] * 0.8 - 350;
        strengthPowerup.position.y = 2;

        strengthPowerup.scale.set(2, 2, 2)

        assignController(strengthPowerup, "powerup")
        assignLayer(strengthPowerup, 3)

        root.add(agilityPowerup);
        root.add(strengthPowerup);

    }
    for (let i = 80; i < points.length - 1; i += 80) {

        let box = builder.generateBox(points[i], points[i + 1], 3, 3, 3)
        box.position.x = box.position.x * 0.8
        box.position.z = box.position.z * 0.8

        box.position.x -= 75;
        box.position.z -= 350;

        box.id = "checkpoint-" + checkPointCounter;
        checkPointCounter++;
        box.alias = "checkpoint"
        box.visible = false;
        assignController(box, "checkpoint")
        assignLayer(box, 1)
        root.add(box);


    }

    let lastBox = builder.generateBox(points[points.length - 4], points[points.length - 3], 4, 2, 4)
    lastBox.position.x = lastBox.position.x * 0.8
    lastBox.position.z = lastBox.position.z * 0.8

    lastBox.position.x -= 70;
    lastBox.position.z -= 354;
    lastBox.id = "checkpoint-" + checkPointCounter;
    lastBox.alias = "checkpoint"
    lastBox.visible = true;
    assignController(lastBox, "checkpoint")
    assignLayer(lastBox, 1)
    root.add(lastBox);




    let sideZone = builder.generateEmpty();
    let parkingLot = builder.generateParkingLot();
    parkingLot.scale.set(10, 1, 10);
    let plane = builder.generatePlane();

    for (let i = 0; i < 6; i++) {
        let crate = builder.generateCrate();
        let bananaObstacle = builder.generateBananaObstacle();
        bananaObstacle.scale.set(0.05, 0.05, 0.05);
        bananaObstacle.position.set(-350, 10, -130 + i * 50 + 350);
        crate.position.set(-350 + 100, 0, -130 + i * 50 + 350);
        assignController(crate, "crate")
        assignController(bananaObstacle, "banana")
        assignLayer(crate, 1);
        assignLayer(bananaObstacle, 1);
        crate.id = "crate-" + i;
        bananaObstacle.id = "banana-" + i;
        root.add(crate, bananaObstacle);

    }

    sideZone.position.set(-350, 0, 350);
    sideZone.add(parkingLot);
    root.add(sideZone)

    assignLayer(car, 1)
    assignLayer(oppCar, 2)
    assignLayer(car, 2)
    assignLayer(car, 3)
    assignController(car, "carController");
    assignController(oppCar, "carAI");
    assignController(root, "race");


    car.alias = "car"
    oppCar.alias = "oppCar"

    car.position.set(-20.447973 - 80, 2, 0.125932 - 350)
    car.rotation.set(0, -40, 0)

    root.add(plane)
    plane.position.set(0, -0.5, 0);
    scene.root = root;
    root.add(lights);
    root.add(car);
    root.add(oppCar)
    scene.add(root);
    let bananaHud = builder.generateBananaHud();

    builder.addEnv(scene, "username", "string", context.playerName)
    builder.addEnv(scene, "difficulty", "number", context.level)
    let hud = builder.generateRaceHUD(context.playerName, context.level);
    scene.huds.push(hud);
    scene.huds.push(bananaHud);


    let camera = builder.generateCamera("perspective", {
        near: 0.1, far: 1500, angle: 75,
        position: [0, 12, -25], target: [0, 0, 0],
        follow: car.id
    })

    let sideCamera = builder.generateCamera("perspective", {
        near: 0.1, far: 1500, angle: 75,
        position: [-100, 400, -100], target: [-350, 0, 350],
        follow: sideZone.id
    }, "sideCamera")




    assignController(camera, "camera")


    camera.activeHud = hud.id;
    scene.cameras.push(camera);
    scene.cameras.push(sideCamera);
    scene.initialCamera = camera;


    return scene.toString();
}

export { create };

function assignController(node, script) {

    node.controller = `../projects/racingGame/scripts/${script}.js`;

}

function assignLayer(node, layer) {
    node.layers.push(layer);
}
