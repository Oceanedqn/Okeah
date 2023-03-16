using Microsoft.AspNetCore.Components;

namespace Okeah.Client.Shared.Component
{
    public partial class BarChart
    {
        [Parameter] public List<int>? DataList { get; set; }
        [Parameter] public int Type { get; set; } = 3; // 1 : Semaine en cours, 2 : Semaines, 3 : Mois
        
        public List<string> AxeMonth = new List<string>() { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Nov", "Oct", "Dec" };
        public List<string> AxeDay = new List<string>() { "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim" };
        public List<string> AxeWeek = new List<string>() { "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S3", "S3", "S3", "S3", "S3", "S3", "S3", "S3", "S3", "S3", "S3" };

        public List<int> OrderedList = new List<int>();

        private List<DataChart> DataChartList = new List<DataChart>();
        private List<string> Axis = new List<string>();
        private double _widthBatonColor;
        private double _calculWidthRow;
        private int _height = 319;
        private int _width = 1420;


        protected override void OnInitialized()
        {
            MatchNumberDataLabelAxis();
            InitialiseData();

            _calculWidthRow = _width / DataList!.Count;
            _widthBatonColor = _calculWidthRow - 50;
        }


        /// <summary>
        /// Match les données
        /// </summary>
        private void MatchNumberDataLabelAxis()
        {
            switch (Type)
            {
                case 1:
                    Axis = AxeDay;
                    break;
                case 2:
                    Axis = AxeWeek;
                    break;
                case 3:
                    Axis = AxeMonth;
                    break;
                default:
                    Axis = new List<string>() { "" };
                    break;
            }

            for (int i = 50; i < DataList!.Max(); i += 50)
            {
                OrderedList.Insert(0, i);
            }
        }


        /// <summary>
        /// Initialise les données
        /// </summary>
        private void InitialiseData()
        {
            foreach (int value in DataList!)
            {
                DataChartList.Add(new DataChart { RealValue = value, NormalizedValue = Normalize(value), PixelValue = Pixel(value) });
            }
        }


        /// <summary>
        /// Affiche les step de l'abscisse ordonnées
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private int DisplayStep(int value)
        {
            return Pixel(Normalize(value));
        }


        /// <summary>
        /// Normalise la valeur
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private int Normalize(int value)
        {
            return value * 100 / DataList!.Max();
        }


        /// <summary>
        /// Pixelise la valeur
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        private int Pixel(int value)
        {
            return value * _height / 100;
        }


        /// <summary>
        /// Affiche une couleur différente en fonction de la hauteur de la barre
        /// </summary>
        /// <param name="value"></param>
        /// <param name="isBackground"></param>
        /// <returns></returns>
        private string ReturnColor(double value, bool isBackground)
        {
            if (isBackground)
            {
                if (value <= 25)
                {
                    return "background-custom-one";
                }
                else if (value > 25 && value <= 50)
                {
                    return "background-custom-two";
                }
                else if (value > 50 && value <= 75)
                {
                    return "background-custom-three";
                }
                else
                {
                    return "background-custom-four";
                }
            }
            else
            {
                if (value <= 25)
                {
                    return "color-custom-one";
                }
                else if (value > 25 && value <= 50)
                {
                    return "color-custom-two";
                }
                else if (value > 50 && value <= 75)
                {
                    return "color-custom-three";
                }
                else
                {
                    return "color-custom-four";
                }
            }
        }


        public struct DataChart
        {
            public int RealValue { get; set; }
            public double NormalizedValue { get; set; }
            public double PixelValue { get; set; }
        }
    }
}